// import cron from "node-cron";

// export const syncAttendence = async (hrModels) => {
//     const { AttendenceSummary, Staff, StaffShift } = hrModels;

//     const runSyncTask = async () => {
//         try {
//             const yesterday = new Date();
//             yesterday.setDate(yesterday.getDate() - 1);
//             const formattedYesterday = yesterday.toISOString().split("T")[0];

//             console.log(`--- Syncing Absent Data for: ${formattedYesterday} ---`);

//             const primaryKeyField = Staff.primaryKeyAttribute || 'id';

//             const [allStaff, allShifts] = await Promise.all([
//                 Staff.findAll({ attributes: [primaryKeyField] }),
//                 StaffShift.findAll()
//             ]);

//             const absentRecord = allStaff.map((staff) => {
//                 const actualId = staff[primaryKeyField];
//                 const shift = allShifts.find(s => s.staffId === actualId);

//                 return {
//                     staffId: actualId,
//                     attendenceDate: formattedYesterday,
//                     shiftStart: shift?.shiftStart || "09:00",
//                     shiftEnd: shift?.shiftEnd || "18:00",
//                     first_in: null,
//                     last_out: null,
//                     workedMinutes: 0,
//                     lateMinutes: 0,
//                     overtimeMinutes: 0,
//                     breakMinutes: 0,
//                     totalPunches: 0,
//                     status: "Absent",
//                     createdAt: new Date()
//                 };
//             });

//             if (absentRecord.length > 0) {
//                 await AttendenceSummary.bulkCreate(absentRecord, { ignoreDuplicates: true });
//                 console.log(`✅ Successfully finalized absent data for ${formattedYesterday}`);
//             } else {
//                 console.log("No staff found to sync.");
//             }
//         } catch (error) {
//             console.error('Error updating yesterday\'s absent data:', error);
//         }
//     };

//     await runSyncTask();
//     cron.schedule("30 8 * * 1-6", runSyncTask);
// };
import { Op } from "sequelize";
import cron from "node-cron";

const processAttendance = async (punchingRecord, targetDate, hrModels) => {
    const { Punching, AttendenceSummary, StaffShift } = hrModels;

    let staffId = punchingRecord.staffId || null;
    let clientId = punchingRecord.pin || punchingRecord.clientId || null;

    const getMinutes = (time) => {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    };

    let shiftStart = "09:00";
    let shiftEnd = "18:00";
    let lateGraceMinutes = 0;
    let isNightShift = false;

    if (staffId) {
        const shift = await StaffShift.findOne({ where: { staffId } });
        if (shift) {
            shiftStart = shift.shiftStart;
            shiftEnd = shift.shiftEnd;
            lateGraceMinutes = shift.lateGraceMinutes || 0;
            isNightShift = getMinutes(shiftEnd) < getMinutes(shiftStart);
        }
    }

    let startOfDay = `${targetDate} 00:00:00`;
    let endOfDay = `${targetDate} 23:59:59`;
    if (isNightShift) {
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);
        endOfDay = `${nextDay.toISOString().split("T")[0]} 23:59:59`;
    }

    // Fetch punches for this staff/client
    const whereClause = { eventDate: { [Op.between]: [startOfDay, endOfDay] } };
    if (staffId) whereClause.staffId = staffId;
    if (clientId) whereClause.pin = clientId;

    const punches = await Punching.findAll({
        where: whereClause,
        order: [["eventDate", "ASC"]]
    });

    punches.forEach((p, i) => {
        p.punchingType = i % 2 === 0 ? "In" : "Out";
    });

    let totalWorkTime = 0;
    let totalBreakTime = 0;
    for (let i = 0; i < punches.length - 1; i++) {
        const curr = punches[i];
        const next = punches[i + 1];
        let diff =
            getMinutes(new Date(next.eventDate).toLocaleTimeString()) -
            getMinutes(new Date(curr.eventDate).toLocaleTimeString());
        if (diff < 0) diff += 1440;
        if (curr.punchingType === "In" && next.punchingType === "Out") totalWorkTime += diff;
        if (curr.punchingType === "Out" && next.punchingType === "In") totalBreakTime += diff;
    }

    const firstIn = punches[0];
    const lastOut = punches[punches.length - 1];

    // Determine status
    let status = punches.length ? "Present" : "Absent";
    let lateMinutes = 0;
    let overtimeMinutes = 0;

    if (staffId && firstIn) {
        const firstInMin = getMinutes(new Date(firstIn.eventDate).toLocaleTimeString());
        const shiftMin = getMinutes(shiftStart) + lateGraceMinutes;
        if (firstInMin > shiftMin) {
            lateMinutes = firstInMin - shiftMin;
            status = "Late";
        }
    }

    if (staffId && lastOut) {
        const outMin = getMinutes(new Date(lastOut.eventDate).toLocaleTimeString());
        const shiftEndMin = getMinutes(shiftEnd);
        if (outMin > shiftEndMin) {
            overtimeMinutes = outMin - shiftEndMin;
        }
    }

    await AttendenceSummary.upsert({
        staffId: staffId || null,
        clientId: clientId || null,
        attendenceDate: targetDate,
        shiftStart,
        shiftEnd,
        first_in: firstIn ? new Date(firstIn.eventDate).toLocaleTimeString() : null,
        last_out: lastOut ? new Date(lastOut.eventDate).toLocaleTimeString() : null,
        workedMinutes: totalWorkTime,
        breakMinutes: totalBreakTime,
        lateMinutes,
        overtimeMinutes,
        totalPunches: punches.length,
        status
    }, {
        conflictFields: staffId ? ["staff_id", "attendence_date"] : ["client_id", "attendence_date"]
    });
};

export const syncAttendence = async (hrModels) => {
    const { AttendenceSummary, Staff, StaffShift, Client, Punching } = hrModels;

    const runSyncTask = async () => {
        try {
            console.log("--- Syncing Historic Attendance for Staff & Clients ---");

            // 1️⃣ Find earliest punch date
            const earliestPunchDate = await Punching.min('eventDate');
            const startDate = earliestPunchDate ? new Date(earliestPunchDate) : new Date();
            const today = new Date();

            const datesToSync = [];
            for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
                datesToSync.push(new Date(d.getTime())); // clone the date
            }

            // 2️⃣ Fetch staff & client lists
            const allStaff = await Staff.findAll({ attributes: ['id'] });
            const allClients = await Client.findAll({ attributes: ['id'] });

            for (const dateObj of datesToSync) {
                const formattedDate = dateObj.toISOString().split("T")[0];

                // 3️⃣ Process Staff Attendance
                for (const staff of allStaff) {
                    await processAttendance({ staffId: staff.id }, formattedDate, hrModels);
                }

                // 4️⃣ Process Client Attendance
                for (const client of allClients) {
                    await processAttendance({ clientId: client.id }, formattedDate, hrModels);
                }
            }

            console.log("✅ Historic attendance synced successfully for staff & clients");
        } catch (error) {
            console.error("Error syncing historic attendance:", error);
        }
    };

    await runSyncTask();
    cron.schedule("30 8 * * 1-6", runSyncTask);
};

// Utility to process summary for a given staffId or clientId

