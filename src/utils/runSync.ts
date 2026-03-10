// import { HRModels } from "../types.js";
// import moment from "moment";

// export const runSyncTask = async (
//     hrModels: HRModels,
//     date?: string
// ) => {
//     const { Staff, AttendenceSummary, Company, StaffShift } = hrModels;

//     try {
//         const formattedDate = date
//             ? moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
//             : moment().subtract(1, "day").format("YYYY-MM-DD");

//         console.log(`--- Syncing Absent Data for: ${formattedDate} ---`);

//         const primaryKeyField = Staff.primaryKeyAttribute || "id";

//         const allStaff = await Staff.findAll({
//             where: { status: true },
//             attributes: [primaryKeyField, "fullName"],
//             include: [
//                 {
//                     model: Company,
//                     attributes: ["id"],
//                     through: { attributes: [] },
//                 },
//             ],
//         });

//         const allShifts = await StaffShift.findAll();

//         const absentRecord = allStaff.flatMap((staff: any) => {
//             const actualId = staff[primaryKeyField];
//             const shift: any = allShifts.find(
//                 (s: any) => s.staffId === actualId
//             );

//             const companies =
//                 staff.Company_Detials?.length > 0
//                     ? staff.Company_Detials
//                     : [{ id: null }];

//             return companies.map((company: any) => ({
//                 staffId: actualId,
//                 staffName: staff.fullName || null,
//                 attendenceDate: formattedDate, // ✅ FIXED
//                 shiftStart: shift?.shiftStart || "09:00",
//                 shiftEnd: shift?.shiftEnd || "18:00",
//                 first_in: null,
//                 last_out: null,
//                 companyId: company.id,
//                 workedMinutes: 0,
//                 lateMinutes: 0,
//                 overtimeMinutes: 0,
//                 breakMinutes: 0,
//                 totalPunches: 0,
//                 status: "Absent",
//             }));
//         });

//         if (absentRecord.length > 0) {
//             await AttendenceSummary.bulkCreate(absentRecord, {
//                 ignoreDuplicates: true,
//             });

//             console.log(
//                 `✅ Successfully finalized absent data for ${formattedDate}`
//             );
//         } else {
//             console.log("No staff found to sync.");
//         }
//     } catch (error: any) {
//         console.error(
//             "Error updating absent data:",
//             error
//         );
//     }
// };
// import { HRModels } from "../types.js";
// import moment from "moment";

// export const runSyncTask = async (
//     hrModels: HRModels,
//     date?: string
// ) => {
//     const { Staff, AttendenceSummary, Company, StaffShift, Schedule } = hrModels;

//     try {
//         const formattedDate = date
//             ? moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
//             : moment().subtract(1, "day").format("YYYY-MM-DD");

//         console.log(`--- Syncing Absent Data for: ${formattedDate} ---`);

//         const primaryKeyField = Staff.primaryKeyAttribute || "id";

//         const allStaff = await Staff.findAll({
//             where: { status: true },
//             attributes: [primaryKeyField, "fullName", "shiftId"],
//             include: [
//                 {
//                     model: Company,
//                     attributes: ["id"],
//                     through: { attributes: [] },
//                 },
//             ],
//             // raw: true,
//             // nest: true
//         }) as any[];


//         const absentRecord = [];

//         for (const staff of allStaff) {
//             const actualId = staff[primaryKeyField];

//             let shiftStart = "09:00";
//             let shiftEnd = "18:00";
//             let lateGraceMinutes = 0;

//             if (staff.shiftId) {
//                 // staff.shiftId is schedule id
//                 const schedule: any = await Schedule.findByPk(staff.shiftId, { raw: true });
//                 if (schedule?.data) {
//                     let staffShiftId: number | null = null;

//                     if (schedule.type === "week") {
//                         const dayKey = moment(formattedDate).format("ddd"); // 'Mon', 'Tue', etc
//                         staffShiftId = schedule.data[dayKey] ?? null;
//                     } else if (schedule.type === "month") {
//                         const dayNo = moment(formattedDate).date(); // 1-31
//                         staffShiftId = schedule.data[`Day ${dayNo}`] ?? null;
//                     }

//                     if (staffShiftId) {
//                         const shift: any = await StaffShift.findByPk(staffShiftId, { raw: true });
//                         if (shift) {
//                             shiftStart = shift.shiftStart;
//                             shiftEnd = shift.shiftEnd;
//                             lateGraceMinutes = shift.lateGraceMinutes || 0;
//                         }
//                     }
//                 }
//             }

//             const companies = staff.Company_Detials?.length > 0 ? staff.Company_Detials : [{ id: null }];

//             for (const company of companies) {
//                 // Check if record already exists
//                 const exists = await AttendenceSummary.findOne({
//                     where: {
//                         staffId: actualId,
//                         attendenceDate: formattedDate,
//                         companyId: company.id,
//                     },
//                     raw: true
//                 });

//                 if (!exists) {
//                     absentRecord.push({
//                         staffId: actualId,
//                         staffName: staff.fullName || null,
//                         attendenceDate: formattedDate,
//                         shiftStart,
//                         shiftEnd,
//                         first_in: null,
//                         last_out: null,
//                         companyId: company.id,
//                         workedMinutes: 0,
//                         lateMinutes: 0,
//                         overtimeMinutes: 0,
//                         breakMinutes: 0,
//                         totalPunches: 0,
//                         status: "Absent",
//                     });
//                 }
//             }

//         }


//         if (absentRecord.length > 0) {
//             await AttendenceSummary.bulkCreate(absentRecord, {
//                 ignoreDuplicates: true,
//             });

//             console.log(
//                 `✅ Successfully finalized absent data for ${formattedDate}`
//             );
//         } else {
//             console.log("No staff found to sync.");
//         }
//     } catch (error: any) {
//         console.error("Error updating absent data:", error);
//     }
// };

import { HRModels } from "../types.js";
import moment from "moment";
import { Op } from "sequelize";

export const runSyncTask = async (
    hrModels: HRModels,
    date?: string
) => {
    const {
        Staff,
        AttendenceSummary,
        Company,
        StaffShift,
        Schedule,
        Punching
    } = hrModels;

    try {
        const formattedDate = date
            ? moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
            : moment().subtract(1, "day").format("YYYY-MM-DD");

        console.log(`--- Syncing Absent Data for: ${formattedDate} ---`);

        const primaryKeyField = Staff.primaryKeyAttribute || "id";

        const allStaff = await Staff.findAll({
            where: { status: true },
            attributes: [primaryKeyField, "fullName", "shiftId"],
            include: [
                {
                    model: Company,
                    attributes: ["id"],
                    through: { attributes: [] },
                },
            ],
        }) as any[];

        const absentRecords: any[] = [];

        for (const staff of allStaff) {
            const staffId = staff[primaryKeyField];

            let shiftStart = "09:00";
            let shiftEnd = "18:00";
            let overtimeLimitMinutes = 360;
            let isNightShift = false;

            /* =========================
               LOAD SHIFT CONFIG
               ========================= */
            if (staff.shiftId) {
                const schedule: any = await Schedule.findByPk(staff.shiftId, { raw: true });

                if (schedule?.data) {
                    let staffShiftId: number | null = null;

                    if (schedule.type === "week") {
                        const dayKey = moment(formattedDate).format("ddd");
                        staffShiftId = schedule.data[dayKey] ?? null;
                    }

                    if (schedule.type === "month") {
                        const dayNo = moment(formattedDate).date();
                        staffShiftId = schedule.data[`Day ${dayNo}`] ?? null;
                    }

                    if (staffShiftId) {
                        const shift: any = await StaffShift.findByPk(staffShiftId, { raw: true });

                        if (shift) {
                            shiftStart = shift.shiftStart;
                            shiftEnd = shift.shiftEnd;
                            overtimeLimitMinutes =
                                shift.overtimeMinutes ?? 360;

                            const startMin = moment(shiftStart, "HH:mm").hours() * 60 +
                                moment(shiftStart, "HH:mm").minutes();
                            const endMin = moment(shiftEnd, "HH:mm").hours() * 60 +
                                moment(shiftEnd, "HH:mm").minutes();

                            isNightShift = endMin < startMin;
                        }
                    }
                }
            }

            /* =========================
               SHIFT DATETIME WINDOW
               ========================= */
            const shiftStartDT = moment(`${formattedDate} ${shiftStart}`);
            let shiftEndDT = moment(`${formattedDate} ${shiftEnd}`);

            if (isNightShift) shiftEndDT.add(1, "day");

            const overtimeEndDT = shiftEndDT
                .clone()
                .add(overtimeLimitMinutes, "minutes");

            // ❗ if overtime window still open → skip absent
            if (moment().isBefore(overtimeEndDT)) {
                continue;
            }

            const companies =
                staff.Company_Detials?.length > 0
                    ? staff.Company_Detials
                    : [{ id: null }];

            for (const company of companies) {
                /* =========================
                   CHECK EXISTING SUMMARY
                   ========================= */
                const exists = await AttendenceSummary.findOne({
                    where: {
                        staffId,
                        attendenceDate: formattedDate,
                        companyId: company.id,
                    },
                    raw: true
                });

                if (exists) continue;

                /* =========================
                   CHECK ANY PUNCH EXISTS
                   ========================= */
                const punchExists = await Punching.findOne({
                    where: {
                        staffId,
                        eventDate: {
                            [Op.between]: [
                                shiftStartDT.clone().subtract(6, "hours").toDate(),
                                overtimeEndDT.toDate()
                            ]
                        }
                    },
                    raw: true
                });

                if (punchExists) continue;

                /* =========================
                   MARK ABSENT
                   ========================= */
                absentRecords.push({
                    staffId,
                    staffName: staff.fullName || null,
                    attendenceDate: formattedDate,
                    shiftStart,
                    shiftEnd,
                    first_in: null,
                    last_out: null,
                    companyId: company.id,
                    workedMinutes: 0,
                    lateMinutes: 0,
                    overtimeMinutes: 0,
                    breakMinutes: 0,
                    totalPunches: 0,
                    status: "Absent",
                });
            }
        }

        if (absentRecords.length) {
            await AttendenceSummary.bulkCreate(absentRecords, {
                ignoreDuplicates: true,
            });

            console.log(`✅ Absent sync completed for ${formattedDate}`);
        } else {
            console.log("ℹ️ No absents to sync.");
        }
    } catch (error: any) {
        console.error("❌ Error updating absent data:", error);
    }
};
