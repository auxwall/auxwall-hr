import { Op } from "sequelize";
import moment from "moment";
import { HRModels } from "../types.js";

export const updateAttendanceSummary = async (
    punchingRecord: any,
    hrModels: HRModels
) => {
    const {
        Staff,
        Schedule,
        StaffShift,
        Punching,
        AttendenceSummary
    } = hrModels;
    console.log("🟢 updateAttendanceSummary started");
    console.log(punchingRecord);
    // const { staffId, eventDate } = punchingRecord;
    // const record = punchingRecord.dataValues || punchingRecord;
    // const { staffId, eventDate } = record;
    let record;

    if (Array.isArray(punchingRecord)) {

        if (punchingRecord.length === 0) {
            console.log("⛔ Empty punches array");
            return;
        }

        record =
            punchingRecord[0].dataValues ||
            punchingRecord[0];

    } else {

        record =
            punchingRecord.dataValues ||
            punchingRecord;
    }

    const { staffId, eventDate } = record;



    if (!staffId || !eventDate) {
        console.log("⛔ Missing staffId / eventDate", record);
        return;
    }
    let isUnauthorized = false;
    // if (!staffId || !eventDate) {
    //     console.log("⛔ Missing staffId / eventDate", punchingRecord);
    //     return;
    // }

    /* =========================
       1️⃣ STAFF
       ========================= */
    const staff: any = await Staff.findOne({
        where: { id: staffId },
        attributes: ["fullName", "shiftId", "scheduleId"],
        raw: true
    });

    if (!staff?.scheduleId) {
        console.log("⛔ Staff not found or no schedule assigned", staffId);
        return;
    }
    // EDIT -I SUCCESS EDIT II 
    // const targetDate = moment(eventDate).format("YYYY-MM-DD");
    const getMinutes = (time: string) => {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    };


    /* =========================
       2️⃣ DEFAULT SHIFT VALUES
       ========================= */
    let shiftStart = "09:00";
    let shiftEnd = "18:00";
    let lateGraceMinutes = 0;
    let overtimeLimitMinutes = 360; // default 6 hours
    let isNightShift = false;

    // EDIT II
    const baseDate = moment(eventDate).format("YYYY-MM-DD");
    let targetDate = baseDate;

    // EDIT III
    const currentDate = moment(eventDate);
    const prevDate = currentDate.clone().subtract(1, "day");
    /* =========================
       3️⃣ LOAD SCHEDULE & SHIFT
       ========================= */
    // const schedule: any = await Schedule.findOne({
    //     where: { id: staff.shiftId },
    //     raw: true
    // });
    const schedule: any = await Schedule.findOne({
        where: { id: staff.scheduleId },
        raw: true
    });
    console.log("schedule");

    if (schedule?.data) {
        let staffShiftId: number | null = null;
        // EDIT III
        let shiftDate = currentDate.clone();

        // 👉 Try current day first
        let dayKey = currentDate.format("ddd");
        staffShiftId = schedule.data[dayKey] ?? null;

        // 👉 If no shift → try previous day (for night shift)
        if (!staffShiftId) {
            dayKey = prevDate.format("ddd");
            staffShiftId = schedule.data[dayKey] ?? null;

            if (staffShiftId) {
                shiftDate = prevDate.clone(); // ✅ VERY IMPORTANT
            }
        }
        // EDIT II
        // if (schedule.type === "week") {
        //     const dayKey = moment(baseDate).format("ddd");
        //     staffShiftId = schedule.data[dayKey] ?? null;
        // }

        // if (schedule.type === "month") {
        //     const dayNo = moment(baseDate).date();
        //     staffShiftId = schedule.data[`Day ${dayNo}`] ?? null;
        // }

        console.log("Schedule record:", schedule);
        console.log("Schedule data:", schedule?.data);
        console.log("Target date:", baseDate);
        console.log("Day key:", moment(baseDate).format("ddd"));
        console.log("Selected shiftId:", staffShiftId);


        if (staffShiftId) {
            const shift: any = await StaffShift.findByPk(staffShiftId, {
                raw: true
            });
            console.log("Loaded shift:", shift);

            if (shift) {
                shiftStart = shift.shiftStart;
                shiftEnd = shift.shiftEnd;
                lateGraceMinutes = shift.lateGraceMinutes || 0;

                overtimeLimitMinutes =
                    shift.overtimeMinutes !== null &&
                        shift.overtimeMinutes !== undefined
                        ? shift.overtimeMinutes
                        : 360;

                const startM = getMinutes(shiftStart);
                const endM = getMinutes(shiftEnd);
                isNightShift = endM < startM;
                const targetMoment = moment(eventDate);

                const adjustedMoment =
                    isNightShift && currentDate.hour() < 12
                        ? shiftDate.clone()
                        : shiftDate.clone();

                targetDate = adjustedMoment.format("YYYY-MM-DD");
            }

        }
    }

    // EDIT II



    /* =========================
       4️⃣ SHIFT DATETIMES
       ========================= */
    const shiftStartDT = moment(`${targetDate} ${shiftStart}`);
    let shiftEndDT = moment(`${targetDate} ${shiftEnd}`);

    if (isNightShift || shiftEndDT.isBefore(shiftStartDT)) {
        shiftEndDT.add(1, "day");
    }

    const overtimeEndDT = shiftEndDT
        .clone()
        .add(overtimeLimitMinutes, "minutes");

    /* =========================
       5️⃣ PUNCH RANGE
       ========================= */
    const startOfRange = shiftStartDT.clone().subtract(12, "hours").toDate();
    const endOfRange = overtimeEndDT.toDate();
    const punches: any[] = await Punching.findAll({
        where: {
            staffId,
            eventDate: { [Op.between]: [startOfRange, endOfRange] }
        },
        order: [["eventDate", "ASC"]],
        raw: true
    });

    if (!punches.length) {
        await AttendenceSummary.upsert(
            {
                staffId,
                staffName: staff.fullName,
                attendenceDate: targetDate,
                shiftStart,
                shiftEnd,
                status: "Absent"
            },
            {
                conflictFields: ["staff_id", "attendence_date"]
            }
        );
        return;
    }

    /* =========================
       6️⃣ ASSIGN IN / OUT
       ========================= */
    punches.forEach((p, i) => {
        p.punchingType = i % 2 === 0 ? "In" : "Out";
    });

    const isLastPunchIn = punches.length % 2 !== 0;
    let lastOut = punches[punches.length - 1];
    let lastOutDT = moment(lastOut.eventDate);
    /* =========================
       7️⃣ WORK & BREAK TIME
       ========================= */

    // for (let i = 0; i < punches.length - 1; i++) {
    //     const diff = moment(punches[i + 1].eventDate).diff(
    //         moment(punches[i].eventDate),
    //         "minutes"
    //     );

    //     if (punches[i].punchingType === "In")
    //         workedMinutes += diff;
    //     else breakMinutes += diff;
    // }
    //  EDIT II
    const firstIn = punches.find(p =>
        moment(p.eventDate).isSameOrAfter(shiftStartDT)
    ) || punches[0];



    if (isLastPunchIn) {
        console.log("⚠️ Missing OUT punch detected");
        // EDIT - I
        // Case 1: Last punch is before shift end → assume shift end
        // if (lastOutDT.isBefore(shiftEndDT)) {
        //     lastOutDT = shiftEndDT.clone();
        // }
        if (lastOutDT.isBefore(shiftEndDT)) {
            console.log("⚠️ Early exit detected");
        }

        // Case 2: Last punch is after shift end → use actual punch
        else {
            lastOutDT = moment(lastOut.eventDate);
            isUnauthorized = true;
        }

    }

    let workedMinutes = 0;
    let breakMinutes = 0;

    for (let i = 0; i < punches.length; i++) {
        const current = punches[i];
        const next = punches[i + 1];

        const currentDT = moment(current.eventDate);

        let endDT;

        if (next) {
            endDT = moment(next.eventDate);
        } else if (isLastPunchIn) {
            // handle missing OUT
            endDT = lastOutDT;
        } else {
            continue;
        }

        const diff = endDT.diff(currentDT, "minutes");

        if (current.punchingType === "In") {
            workedMinutes += diff;
        } else {
            breakMinutes += diff;
        }
    }


    let status = "Absent";
    let lateMinutes = 0;
    let overtimeMinutes = 0;

    const firstInDT = moment(firstIn.eventDate);
    // const lastOutDT = moment(lastOut.eventDate);

    const lateThresholdDT = shiftStartDT.clone().add(lateGraceMinutes, "minutes");

    if (firstInDT.isAfter(lateThresholdDT)) {
        lateMinutes = firstInDT.diff(lateThresholdDT, "minutes");
    }
    //EDIT I - latest edit commented this and made last_out.eventDate to lastOutDT in output and added below line
    /* ===== Calculate overtime ===== */
    // if (lastOutDT.isAfter(shiftEndDT)) {
    //     overtimeMinutes = lastOutDT.diff(shiftEndDT, "minutes");
    //     overtimeMinutes = Math.min(overtimeMinutes, overtimeLimitMinutes);
    // }
    const shiftDurationMinutes = shiftEndDT.diff(shiftStartDT, "minutes");
    const halfDayMinutes = shiftDurationMinutes / 2;
    const extraWorkedMinutes = workedMinutes - shiftDurationMinutes;

    if (extraWorkedMinutes > 0) {
        overtimeMinutes = Math.min(extraWorkedMinutes, overtimeLimitMinutes);
    } else {
        overtimeMinutes = 0;
    }

    // /* ===== Shift duration ===== */
    // const shiftDurationMinutes = shiftEndDT.diff(shiftStartDT, "minutes");
    // const halfDayMinutes = shiftDurationMinutes / 2;

    /* ===== STATUS RULES ===== */

    if (isUnauthorized) {
        overtimeMinutes = 0;
        status = "Unauthorized";
    } else if (workedMinutes === 0) {
        status = "Absent";
    }
    else if (workedMinutes < halfDayMinutes) {
        status = "Half Day";
    }
    else if (lateMinutes > 0) {
        status = "Late";
    }
    else {
        status = "Present";
    }
    console.log("✅ Summary data:", {
        staffId,
        staffName: staff.fullName,
        attendenceDate: targetDate,
        shiftStart,
        shiftEnd,
        first_in: moment(firstIn.eventDate).format("HH:mm:ss"),
        last_out: moment(lastOutDT).format("HH:mm:ss"),
        workedMinutes,
        breakMinutes,
        lateMinutes,
        overtimeMinutes,
        totalPunches: punches.length,
        status
    });

    /* =========================
       9️⃣ UPSERT SUMMARY
       ========================= */
    await AttendenceSummary.upsert(
        {
            staffId,
            staffName: staff.fullName,
            attendenceDate: targetDate,
            shiftStart,
            shiftEnd,
            first_in: moment(firstIn.eventDate).format("HH:mm:ss"),
            last_out: moment(lastOutDT).format("HH:mm:ss"),
            workedMinutes,
            breakMinutes,
            lateMinutes,
            overtimeMinutes,
            totalPunches: punches.length,
            status
        },
        {
            conflictFields: ["staff_id", "attendence_date"]
        }
    );
};

