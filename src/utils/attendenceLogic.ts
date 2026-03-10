// // import { Op } from "sequelize";
// // import { HRModels } from "../types.js";
// // import moment from "moment";

// // interface PunchingRecord {
// //     staffId: number;
// //     eventDate: Date | string;
// //     [key: string]: any;
// // }

// // export const updateAttendanceSummary = async (punchingRecord: PunchingRecord, hrModels: HRModels) => {
// //     const { StaffShift, AttendenceSummary, Punching, Staff } = hrModels;
// //     const { staffId, eventDate } = punchingRecord;

// //     // 🚨 Validation
// //     // const clientId = pin;
// //     // if (!staffId && !clientId) {
// //     //     console.warn("Punch ignored: No staffId or clientId");
// //     //     return;
// //     // }
// //     if (!staffId) {
// //         return;
// //     }
// //     const staff: any = await Staff.findOne({
// //         where: { id: staffId },
// //         attributes: ['fullName', 'shiftId'],
// //         raw: true
// //     });

// //     const getMinutes = (time: string) => {
// //         const [h, m] = time.split(":").map(Number);
// //         return h * 60 + m;
// //     };

// //     const punchMoment = moment(eventDate);
// //     const targetDate = punchMoment.format("YYYY-MM-DD");

// //     /* =========================
// //        1️⃣ SHIFT HANDLING
// //        ========================= */
// //     let shiftStart = "09:00";
// //     let shiftEnd = "18:00";
// //     let lateGraceMinutes = 0;
// //     let isNightShift = false;

// //     if (staff?.shiftId) {
// //         const shift: any = await StaffShift.findOne({
// //             where: { id: staff.shiftId },
// //             attributes: ['shiftStart', 'shiftEnd', 'lateGraceMinutes'],
// //             raw: true
// //         });
// //         if (shift) {
// //             shiftStart = shift.shiftStart;
// //             shiftEnd = shift.shiftEnd;
// //             lateGraceMinutes = shift.lateGraceMinutes || 0;

// //             const startM = getMinutes(shiftStart);
// //             const endM = getMinutes(shiftEnd);
// //             isNightShift = endM < startM;
// //         }
// //     }

// //     /* =========================
// //        2️⃣ DATE RANGE
// //        ========================= */
// //     let startOfDay = moment(targetDate).startOf("day").toDate();
// //     let endOfDay = moment(targetDate).endOf("day").toDate();

// //     if (isNightShift) {
// //         endOfDay = moment(targetDate)
// //             .add(1, "day")
// //             .endOf("day")
// //             .toDate();
// //     } else {
// //         endOfDay = moment(targetDate)
// //             .add(1, "day")
// //             .hour(6)
// //             .minute(29)
// //             .second(59)
// //             .toDate();
// //     }

// //     /* =========================
// //        3️⃣ PUNCH FETCH (FIXED)
// //        ========================= */
// //     const whereClause: any = {
// //         eventDate: { [Op.between]: [startOfDay, endOfDay] }
// //     };

// //     if (staffId) whereClause.staffId = staffId;
// //     // if (clientId) whereClause.pin = clientId;

// //     const punches: any[] = await Punching.findAll({
// //         where: whereClause,
// //         order: [["eventDate", "ASC"]]
// //     });

// //     punches.forEach((p, i) => {
// //         p.punchingType = i % 2 === 0 ? "In" : "Out";
// //     });

// //     /* =========================
// //        4️⃣ CALCULATIONS
// //        ========================= */
// //     let totalWorkTime = 0;
// //     let totalBreakTime = 0;

// //     for (let i = 0; i < punches.length - 1; i++) {
// //         const curr = punches[i];
// //         const next = punches[i + 1];

// //         let diff = moment(next.eventDate).diff(
// //             moment(curr.eventDate),
// //             "minutes"
// //         );

// //         const duration = diff < 0 ? diff + 1440 : diff;

// //         if (curr.punchingType === "In" && next.punchingType === "Out")
// //             totalWorkTime += duration;

// //         if (curr.punchingType === "Out" && next.punchingType === "In")
// //             totalBreakTime += duration;
// //     }

// //     const firstIn = punches[0];
// //     const lastOut = punches[punches.length - 1];

// //     /* =========================
// //        5️⃣ STATUS LOGIC
// //        ========================= */
// //     let status = punches.length ? "Present" : "Absent";
// //     let lateMinutes = 0;
// //     let overtimeMinutes = 0;

// //     if (staffId && firstIn) {
// //         const firstInMin =
// //             moment(firstIn.eventDate).hours() * 60 +
// //             moment(firstIn.eventDate).minutes();
// //         const shiftMin = getMinutes(shiftStart) + lateGraceMinutes;

// //         if (firstInMin > shiftMin) {
// //             lateMinutes = firstInMin - shiftMin;
// //             status = "Late";
// //         }
// //     }

// //     if (staffId && lastOut) {
// //         const outMin = moment(lastOut.eventDate).hours() * 60 + moment(lastOut.eventDate).minutes();
// //         const shiftEndMin = getMinutes(shiftEnd);
// //         if (outMin > shiftEndMin) {
// //             overtimeMinutes = outMin - shiftEndMin;
// //         }
// //     }

// //     /* =========================
// //        6️⃣ UPSERT (FIXED)
// //        ========================= */
// //     await AttendenceSummary.upsert(
// //         {
// //             staffId: staffId || null,
// //             // clientId: clientId || null,
// //             staffName: staff?.fullName || null,
// //             // companyId: companyId || null,
// //             attendenceDate: targetDate,
// //             shiftStart,
// //             shiftEnd,

// //             first_in: firstIn
// //                 ? moment(firstIn.eventDate).format("HH:mm:ss")
// //                 : null,
// //             last_out: lastOut
// //                 ? moment(lastOut.eventDate).format("HH:mm:ss")
// //                 : null,
// //             workedMinutes: totalWorkTime,
// //             breakMinutes: totalBreakTime,
// //             lateMinutes,
// //             overtimeMinutes,
// //             totalPunches: punches.length,
// //             status
// //         },
// //         {
// //             conflictFields: staffId
// //                 ? ["staff_id", "attendence_date"] : undefined,
// //             // : ["company_id", "client_id", "attendence_date"]
// //         }
// //     );
// // };


// import { Op } from "sequelize";
// import moment from "moment";
// import { HRModels } from "../types.js";

// export const updateAttendanceSummary = async (
//     punchingRecord,
//     hrModels: HRModels
// ) => {
//     const {
//         Staff,
//         Schedule,
//         StaffShift,
//         Punching,
//         AttendenceSummary
//     } = hrModels;

//     const { staffId, eventDate } = punchingRecord;
//     if (!staffId) return;

//     const staff: any = await Staff.findOne({
//         where: { id: staffId },
//         attributes: ["fullName", "shiftId"],
//         raw: true
//     });

//     const targetDate = moment(eventDate).format("YYYY-MM-DD");

//     const getMinutes = (time: string) => {
//         const [h, m] = time.split(":").map(Number);
//         return h * 60 + m;
//     };

//     /* =========================
//        1️⃣ GET SHIFT FROM SCHEDULE
//        ========================= */
//     let shiftStart = "09:00";
//     let shiftEnd = "18:00";
//     let lateGraceMinutes = 0;
//     let isNightShift = false;

//     if (staff?.shiftId) {
//         const schedule: any = await Schedule.findOne({
//             where: { id: staff.shiftId },
//             raw: true
//         });

//         if (schedule?.data) {
//             let staffShiftId: number | null = null;

//             if (schedule.type === "week") {
//                 const dayKey = moment(targetDate).format("ddd"); // Mon
//                 staffShiftId = schedule.data[dayKey] ?? null;
//             }

//             if (schedule.type === "month") {
//                 const dayNo = moment(targetDate).date();
//                 staffShiftId = schedule.data[`Day ${dayNo}`] ?? null;
//             }

//             if (staffShiftId) {
//                 const shift: any = await StaffShift.findByPk(staffShiftId, {
//                     raw: true
//                 });

//                 if (shift) {
//                     shiftStart = shift.shiftStart;
//                     shiftEnd = shift.shiftEnd;
//                     lateGraceMinutes = shift.lateGraceMinutes || 0;

//                     const startM = getMinutes(shiftStart);
//                     const endM = getMinutes(shiftEnd);
//                     isNightShift = endM < startM;
//                 }
//             }
//         }
//     }

//     /* =========================
//        2️⃣ DATE RANGE
//        ========================= */
//     let startOfDay = moment(targetDate).startOf("day").toDate();
//     let endOfDay = isNightShift
//         ? moment(targetDate).add(1, "day").endOf("day").toDate()
//         : moment(targetDate)
//             .add(1, "day")
//             .hour(6)
//             .minute(29)
//             .second(59)
//             .toDate();

//     /* =========================
//        3️⃣ FETCH PUNCHES
//        ========================= */
//     const punches: any[] = await Punching.findAll({
//         where: {
//             staffId,
//             eventDate: { [Op.between]: [startOfDay, endOfDay] }
//         },
//         order: [["eventDate", "ASC"]]
//     });

//     punches.forEach((p, i) => {
//         p.punchingType = i % 2 === 0 ? "In" : "Out";
//     });

//     /* =========================
//        4️⃣ CALCULATIONS
//        ========================= */
//     let workedMinutes = 0;
//     let breakMinutes = 0;

//     for (let i = 0; i < punches.length - 1; i++) {
//         const diff = moment(punches[i + 1].eventDate).diff(
//             moment(punches[i].eventDate),
//             "minutes"
//         );

//         if (punches[i].punchingType === "In")
//             workedMinutes += diff;
//         else breakMinutes += diff;
//     }

//     const firstIn = punches[0];
//     const lastOut = punches[punches.length - 1];

//     /* =========================
//        5️⃣ STATUS
//        ========================= */
//     let status = punches.length ? "Present" : "Absent";
//     let lateMinutes = 0;
//     let overtimeMinutes = 0;

//     if (firstIn) {
//         const inMin =
//             moment(firstIn.eventDate).hours() * 60 +
//             moment(firstIn.eventDate).minutes();

//         const shiftMin = getMinutes(shiftStart) + lateGraceMinutes;

//         if (inMin > shiftMin) {
//             lateMinutes = inMin - shiftMin;
//             status = "Late";
//         }
//     }

//     if (lastOut) {
//         const outMin =
//             moment(lastOut.eventDate).hours() * 60 +
//             moment(lastOut.eventDate).minutes();

//         const shiftEndMin = getMinutes(shiftEnd);
//         if (outMin > shiftEndMin)
//             overtimeMinutes = outMin - shiftEndMin;
//     }

//     /* =========================
//        6️⃣ UPSERT SUMMARY
//        ========================= */
//     await AttendenceSummary.upsert(
//         {
//             staffId,
//             staffName: staff?.fullName,
//             attendenceDate: targetDate,
//             shiftStart,
//             shiftEnd,
//             first_in: firstIn
//                 ? moment(firstIn.eventDate).format("HH:mm:ss")
//                 : null,
//             last_out: lastOut
//                 ? moment(lastOut.eventDate).format("HH:mm:ss")
//                 : null,
//             workedMinutes,
//             breakMinutes,
//             lateMinutes,
//             overtimeMinutes,
//             totalPunches: punches.length,
//             status
//         },
//         {
//             conflictFields: ["staff_id", "attendence_date"]
//         }
//     );
// };

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

    const { staffId, eventDate } = punchingRecord;
    if (!staffId || !eventDate) {
        console.log("⛔ Missing staffId / eventDate", punchingRecord);
        return;
    }

    /* =========================
       1️⃣ STAFF
       ========================= */
    const staff: any = await Staff.findOne({
        where: { id: staffId },
        attributes: ["fullName", "shiftId"],
        raw: true
    });

    if (!staff?.shiftId) {
        console.log("⛔ Staff not found or no shift assigned", staffId);
        return;
    }

    const targetDate = moment(eventDate).format("YYYY-MM-DD");

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

    /* =========================
       3️⃣ LOAD SCHEDULE & SHIFT
       ========================= */
    const schedule: any = await Schedule.findOne({
        where: { id: staff.shiftId },
        raw: true
    });
    console.log("schedule");

    if (schedule?.data) {
        let staffShiftId: number | null = null;

        if (schedule.type === "week") {
            const dayKey = moment(targetDate).format("ddd");
            staffShiftId = schedule.data[dayKey] ?? null;
        }

        if (schedule.type === "month") {
            const dayNo = moment(targetDate).date();
            staffShiftId = schedule.data[`Day ${dayNo}`] ?? null;
        }

        if (staffShiftId) {
            const shift: any = await StaffShift.findByPk(staffShiftId, {
                raw: true
            });

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
            }
        }
    }

    /* =========================
       4️⃣ SHIFT DATETIMES
       ========================= */
    const shiftStartDT = moment(`${targetDate} ${shiftStart}`);
    let shiftEndDT = moment(`${targetDate} ${shiftEnd}`);

    if (isNightShift) {
        shiftEndDT.add(1, "day");
    }

    const overtimeEndDT = shiftEndDT
        .clone()
        .add(overtimeLimitMinutes, "minutes");

    /* =========================
       5️⃣ PUNCH RANGE
       ========================= */
    const startOfRange = shiftStartDT.clone().subtract(6, "hours").toDate();
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

    /* =========================
       7️⃣ WORK & BREAK TIME
       ========================= */
    let workedMinutes = 0;
    let breakMinutes = 0;

    for (let i = 0; i < punches.length - 1; i++) {
        const diff = moment(punches[i + 1].eventDate).diff(
            moment(punches[i].eventDate),
            "minutes"
        );

        if (punches[i].punchingType === "In")
            workedMinutes += diff;
        else breakMinutes += diff;
    }

    const firstIn = punches[0];
    const lastOut = punches[punches.length - 1];

    /* =========================
       8️⃣ STATUS, LATE, OT
       ========================= */
    let status = "Present";
    let lateMinutes = 0;
    let overtimeMinutes = 0;

    const firstInDT = moment(firstIn.eventDate);
    const lateThresholdDT = shiftStartDT.clone().add(lateGraceMinutes, "minutes");

    if (firstInDT.isAfter(lateThresholdDT)) {
        lateMinutes = firstInDT.diff(lateThresholdDT, "minutes");
        status = "Late";
    }

    const lastOutDT = moment(lastOut.eventDate);

    if (lastOutDT.isAfter(shiftEndDT)) {
        overtimeMinutes = lastOutDT.diff(shiftEndDT, "minutes");
        overtimeMinutes = Math.min(overtimeMinutes, overtimeLimitMinutes);
    }

    if (overtimeMinutes > 0 && status === "Present") {
        status = "Overtime";
    }

    if (overtimeMinutes > 0 && lateMinutes > 0) {
        status = "Late + Overtime";
    }
    console.log("✅ Summary data:", {
        staffId,
        staffName: staff.fullName,
        attendenceDate: targetDate,
        shiftStart,
        shiftEnd,
        first_in: moment(firstIn.eventDate).format("HH:mm:ss"),
        last_out: moment(lastOut.eventDate).format("HH:mm:ss"),
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
            last_out: moment(lastOut.eventDate).format("HH:mm:ss"),
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
