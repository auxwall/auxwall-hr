// attendanceLogic.js
import { Op } from "sequelize";
export const updateAttendanceSummary = async (punchingRecord, hrModels) => {
    const { StaffShift, AttendenceSummary, Punching } = hrModels;
    const { staffId, punchingDate, punchingTime } = punchingRecord;

    const getMinutes = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    }

    const shift = await StaffShift.findOne({ where: { staffId } });

    const shiftStartMins = getMinutes(shift.shiftStart);
    const shiftEndMins = getMinutes(shift.shiftEnd);
    let isNightShift = shiftEndMins < shiftStartMins;
    let formattedDate = new Date(punchingDate).toISOString().split('T')[0];
    let targetDate = formattedDate;
    const punchingTimeMins = getMinutes(punchingTime);

    if (isNightShift) {
        const morningThreshold = shiftStartMins - 120;
        if (punchingTimeMins < morningThreshold) {
            let yesterday = new Date(formattedDate);
            yesterday.setDate(yesterday.getDate() - 1);
            targetDate = yesterday.toISOString().split('T')[0];
        }
    }

    let startOfDay = `${targetDate} 00:00:00`;
    let endOfDay = `${targetDate} 23:59:59`;

    if (isNightShift) {
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);
        endOfDay = `${nextDay.toISOString().split('T')[0]} 23:59:59`;
    }

    const punches = await Punching.findAll({
        where: {
            staffId, punchingDate: {
                [Op.between]: [startOfDay, endOfDay]
            }
        }, order: [["punchingDate", "ASC"], ["punchingTime", "ASC"]]
    });

    let totalWorkTime = 0;
    let totalBreakTime = 0;
    let duration = 0;
    for (let i = 0; i < punches.length - 1; i++) {
        const current = punches[i];
        const next = punches[i + 1];
        duration = getMinutes(next.punchingTime) - getMinutes(current.punchingTime);

        if (duration < 0) duration += 1440;

        if (current.punchingType === "In" && next.punchingType === "Out") {
            totalWorkTime += duration;
        }
        if (current.punchingType === "Out" && next.punchingType === "In") {
            totalBreakTime += duration;
        }
    }

    const firstInPunch = punches.find(p => p.punchingType === "In");
    const lastOutPunch = [...punches].reverse().find(p => p.punchingType === "Out");



    let shiftDuration = isNightShift ? (1440 - shiftStartMins) + shiftEndMins : shiftEndMins - shiftStartMins;

    let status = "Present";
    let lateMinutes = 0;
    let overtimeMinutes = 0;

    // 4. Late Calculation
    if (firstInPunch) {
        const firstInMins = getMinutes(firstInPunch.punchingTime);
        const shiftMinutes = shiftStartMins + (shift.lateGraceMinutes || 0);

        if (firstInMins > shiftMinutes) {
            lateMinutes = firstInMins - shiftMinutes;
            status = "Late";
        }
    }

    // 5. Overtime Calculation (Only if there is a Last Out)
    if (lastOutPunch) {
        const lastOutMins = getMinutes(lastOutPunch.punchingTime);
        if (isNightShift) {
            if (lastOutMins < shiftStartMins) {
                overtimeMinutes = lastOutMins + 1440 - shiftEndMins;
            }
        } else {
            if (lastOutMins > shiftEndMins) {
                overtimeMinutes = lastOutMins - shiftEndMins;
            }
        }
    }

    // 6. Half Day Check
    if (totalWorkTime > 0 && totalWorkTime < (shiftDuration / 2)) {
        status = "Half Day";
    }

    if (punches.length === 0) {
        status = "Absent";
    }

    await AttendenceSummary.upsert({
        staffId,
        attendenceDate: targetDate,
        shiftStart: shift.shiftStart,
        shiftEnd: shift.shiftEnd,
        first_in: firstInPunch?.punchingTime || null,
        last_out: lastOutPunch?.punchingTime || null,
        workedMinutes: totalWorkTime,
        lateMinutes,
        overtimeMinutes,
        breakMinutes: totalBreakTime,
        totalPunches: punches.length,
        status,
        createdAt: () => new Date()
    }, {
        conflictFields: ['staff_id', 'attendence_date']
    });

};