// attendanceLogic.js
import { Op } from "sequelize";
export const updateAttendanceSummary = async (punchingRecord, hrModels) => {
    const { StaffShift, AttendenceSummary, Punching } = hrModels;
    const { staffId, punchingDate } = punchingRecord;
    const formattedDate = new Date(punchingDate).toISOString().split('T')[0];
    const startOfDay = `${formattedDate} 00:00:00`;
    const endOfDay = `${formattedDate} 23:59:59`;
    // 1. Get the Staff's Shift requirements
    const shift = await StaffShift.findOne({ where: { staffId } });
    const allPunches = await Punching.findAll({
        where: {
            staffId, punchingDate: {
                [Op.between]: [startOfDay, endOfDay]
            }
        }, order: [["punchingTime", "ASC"]]
    });
    const getMinutes = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    }

    let totalWorkTime = 0;
    let totalBreakTime = 0;

    for (let i = 0; i < allPunches.length - 1; i++) {
        const current = allPunches[i];
        const next = allPunches[i + 1];
        let duration = getMinutes(next.punchingTime) - getMinutes(current.punchingTime);

        if (duration < 0) duration += 1440;

        if (current.punchingType === "In" && next.punchingType === "Out") {
            totalWorkTime += duration;
        }
        if (current.punchingType === "Out" && next.punchingType === "In") {
            totalBreakTime += duration;
        }
    }
    const firstInPunch = allPunches.find(p => p.punchingType === "In");
    const lastOutPunch = [...allPunches].reverse().find(p => p.punchingType === "Out");


    const shiftStartMins = getMinutes(shift.shiftStart);
    const shiftEndMins = getMinutes(shift.shiftEnd);
    let isNightShift = shiftEndMins < shiftStartMins;
    let shiftDuration = isNightShift ? (1440 - shiftStartMins) + shiftEndMins : shiftEndMins - shiftStartMins;

    let status = "Present";
    let lateMinutes = 0;
    let overtimeMinutes = 0;

    // 4. Late Calculation
    if (firstInPunch) {
        const firstInMins = getMinutes(firstInPunch.punchingTime);
        const shiftMinutes = shiftStartMins + (shift.lateGraceMinutes || 0);

        if (firstInMins > shiftMinutes) {
            lateMinutes = firstInMins - shiftStartMins;
            status = "Late";
        }
    }

    // 5. Overtime Calculation (Only if there is a Last Out)
    if (lastOutPunch) {
        const lastOutMins = getMinutes(lastOutPunch.punchingTime);
        overtimeMinutes = lastOutMins - shiftEndMins;
    }

    // 6. Half Day Check
    if (totalWorkTime > 0 && totalWorkTime < (shiftDuration / 2)) {
        status = "Half Day";
    }
    await AttendenceSummary.upsert({
        staffId,
        attendenceDate: formattedDate,
        shiftStart: shift.shiftStart,
        shiftEnd: shift.shiftEnd,
        first_in: firstInPunch?.punchingTime || null,
        last_out: lastOutPunch?.punchingTime || null,
        workedMinutes: totalWorkTime,
        lateMinutes,
        overtimeMinutes,
        breakMinutes: totalBreakTime,
        totalPunches: allPunches.length,
        status,
        createdAt: () => new Date()
    }, {
        conflictFields: ['staff_id', 'attendence_date']
    });

};