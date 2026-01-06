

import { Op } from "sequelize";
import { HRModels } from "../types.js";

interface PunchingRecord {
    staffId: number;
    eventDate: Date | string;
    [key: string]: any;
}

export const updateAttendanceSummary = async (punchingRecord: PunchingRecord, hrModels: HRModels) => {
    const { StaffShift, AttendenceSummary, Punching, Staff } = hrModels;
    const { staffId, eventDate } = punchingRecord;

    // 🚨 Validation
    // const clientId = pin;
    // if (!staffId && !clientId) {
    //     console.warn("Punch ignored: No staffId or clientId");
    //     return;
    // }
    if (!staffId) {
        return;
    }
    const staff: any = await Staff.findOne({ where: { id: staffId }, attributes: ['fullName'], raw: true });

    const getMinutes = (time: string) => {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    };

    const punchDateObj = new Date(eventDate as string | Date);
    const targetDate = punchDateObj.toISOString().split("T")[0];

    /* =========================
       1️⃣ SHIFT HANDLING
       ========================= */
    let shiftStart = "09:00";
    let shiftEnd = "18:00";
    let lateGraceMinutes = 0;
    let isNightShift = false;

    if (staffId) {
        const shift: any = await StaffShift.findOne({ where: { staffId } });
        if (shift) {
            shiftStart = shift.shiftStart;
            shiftEnd = shift.shiftEnd;
            lateGraceMinutes = shift.lateGraceMinutes || 0;

            const startM = getMinutes(shiftStart);
            const endM = getMinutes(shiftEnd);
            isNightShift = endM < startM;
        }
    }

    /* =========================
       2️⃣ DATE RANGE
       ========================= */
    let startOfDay = new Date(`${targetDate} T00:00:00Z`);
    let endOfDay = new Date(`${targetDate} T23:59:59Z`);

    if (isNightShift) {
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);
        endOfDay = new Date(`${nextDay.toISOString().split("T")[0]} T23:59:59Z`);
    }

    /* =========================
       3️⃣ PUNCH FETCH (FIXED)
       ========================= */
    const whereClause: any = {
        eventDate: { [Op.between]: [startOfDay, endOfDay] }
    };

    if (staffId) whereClause.staffId = staffId;
    // if (clientId) whereClause.pin = clientId;

    const punches: any[] = await Punching.findAll({
        where: whereClause,
        order: [["eventDate", "ASC"]]
    });

    punches.forEach((p, i) => {
        p.punchingType = i % 2 === 0 ? "In" : "Out";
    });

    /* =========================
       4️⃣ CALCULATIONS
       ========================= */
    let totalWorkTime = 0;
    let totalBreakTime = 0;

    for (let i = 0; i < punches.length - 1; i++) {
        const curr = punches[i];
        const next = punches[i + 1];

        const diff =
            getMinutes(new Date(next.eventDate).toLocaleTimeString()) -
            getMinutes(new Date(curr.eventDate).toLocaleTimeString());

        const duration = diff < 0 ? diff + 1440 : diff;

        if (curr.punchingType === "In" && next.punchingType === "Out")
            totalWorkTime += duration;

        if (curr.punchingType === "Out" && next.punchingType === "In")
            totalBreakTime += duration;
    }

    const firstIn = punches[0];
    const lastOut = punches[punches.length - 1];

    /* =========================
       5️⃣ STATUS LOGIC
       ========================= */
    let status = punches.length ? "Present" : "Absent";
    let lateMinutes = 0;
    let overtimeMinutes = 0;

    if (staffId && firstIn) {
        const firstInMin = getMinutes(
            new Date(firstIn.eventDate).toLocaleTimeString()
        );
        const shiftMin = getMinutes(shiftStart) + lateGraceMinutes;

        if (firstInMin > shiftMin) {
            lateMinutes = firstInMin - shiftMin;
            status = "Late";
        }
    }

    if (staffId && lastOut) {
        const outMin = getMinutes(
            new Date(lastOut.eventDate).toLocaleTimeString()
        );
        const shiftEndMin = getMinutes(shiftEnd);
        if (outMin > shiftEndMin) {
            overtimeMinutes = outMin - shiftEndMin;
        }
    }

    /* =========================
       6️⃣ UPSERT (FIXED)
       ========================= */
    await AttendenceSummary.upsert(
        {
            staffId: staffId || null,
            // clientId: clientId || null,
            staffName: staff?.fullName || null,
            // companyId: companyId || null,
            attendenceDate: targetDate,
            shiftStart,
            shiftEnd,

            first_in: firstIn
                ? new Date(firstIn.eventDate).toLocaleTimeString()
                : null,
            last_out: lastOut
                ? new Date(lastOut.eventDate).toLocaleTimeString()
                : null,
            workedMinutes: totalWorkTime,
            breakMinutes: totalBreakTime,
            lateMinutes,
            overtimeMinutes,
            totalPunches: punches.length,
            status
        },
        {
            conflictFields: staffId
                ? ["staff_id", "attendence_date"] : undefined,
            // : ["company_id", "client_id", "attendence_date"]
        }
    );
};

