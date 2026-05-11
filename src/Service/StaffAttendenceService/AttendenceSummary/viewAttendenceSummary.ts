// import { HRModels } from '../../../types.js';
// import { Op } from 'sequelize';
// function formatMinutesToHoursMinutes(minutes: number) {
//     const hrs = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return `${hrs}h ${mins}m`;
// }

// export const viewAttendenceSummary = async (
//     limit: number,
//     offset: number,
//     hrModels: HRModels,
//     companyId: number,
//     name,
//     status,
//     from,
//     to
// ) => {
//     try {
//         const { AttendenceSummary, Staff, StaffShift } = hrModels;

//         const now = new Date();
//         const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//         firstDayOfMonth.setHours(0, 0, 0, 0);

//         const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//         lastDayOfMonth.setHours(23, 59, 59, 999);
//         // 1️⃣ Calculate totals using 'status' column
//         const [totalLateStaff, totalAbsentStaff, totalPresentStaff, totalHalfDayStaff] = await Promise.all([
//             AttendenceSummary.count({
//                 where: {
//                     companyId,
//                     status: 'Late',
//                     attendenceDate: { [Op.gte]: firstDayOfMonth, [Op.lte]: lastDayOfMonth }
//                 }
//             }),
//             AttendenceSummary.count({
//                 where: {
//                     companyId,
//                     status: 'Absent',
//                     attendenceDate: { [Op.gte]: firstDayOfMonth, [Op.lte]: lastDayOfMonth }
//                 }
//             }),
//             AttendenceSummary.count({
//                 where: {
//                     companyId,
//                     status: 'Present',
//                     attendenceDate: { [Op.gte]: firstDayOfMonth, [Op.lte]: lastDayOfMonth }
//                 }
//             }),
//             AttendenceSummary.count({
//                 where: {
//                     companyId,
//                     status: 'Half Day',
//                     attendenceDate: { [Op.gte]: firstDayOfMonth, [Op.lte]: lastDayOfMonth }
//                 }
//             })
//         ]);
//         const whereClause: any = {};
//         if (companyId) {
//             whereClause.companyId = companyId
//         }
//         if (name) {
//             whereClause.staffName = { [Op.iLike]: `%${name}%` }
//         }
//         if (status) {
//             whereClause.status = status
//         }
//         if (from || to) {
//             whereClause.attendenceDate = {};

//             if (from) {
//                 const startDate = new Date(from);
//                 startDate.setHours(0, 0, 0, 0);
//                 whereClause.attendenceDate[Op.gte] = startDate;
//             }
//             if (to) {
//                 const endDate = new Date(to);
//                 endDate.setHours(23, 59, 59, 999);
//                 whereClause.attendenceDate[Op.lte] = endDate;
//             }
//         }
//         // 2️⃣ Fetch paginated rows
//         const result = await AttendenceSummary.findAndCountAll({
//             include: [{ model: Staff, as: 'staff', attributes: ['fullName', 'shiftId'] }],
//             where: whereClause,
//             limit,
//             offset,
//             order: [['attendenceDate', 'DESC']]
//         });

//         // 3️⃣ Fetch shifts once
//         const allShifts = await StaffShift.findAll({ attributes: ['id', 'shiftName'] });

//         // 4️⃣ Map rows
//         const mappedRows = result.rows.map((record: any) => {
//             const staffShiftId = record.staff.shiftId;
//             const shift = allShifts.find((s: any) => s.get('id') === staffShiftId);
//             const shiftName = shift?.get('shiftName') || null;

//             return {
//                 ...record.toJSON(),
//                 staffName: record.staff.fullName,
//                 shiftName,
//                 workedTime: formatMinutesToHoursMinutes(record.workedMinutes),
//                 lateTime: formatMinutesToHoursMinutes(record.lateMinutes),
//                 overtime: formatMinutesToHoursMinutes(record.overtimeMinutes),
//                 status: record.status // take status directly from DB
//             };
//         });

//         return {
//             count: result.count,
//             totalLateStaff,
//             totalAbsentStaff,
//             totalPresentStaff,
//             totalHalfDayStaff,
//             rows: mappedRows
//         };
//     } catch (error) {
//         console.error("Error fetching attendence summary:", error);
//         throw error;
//     }
// };




// import { HRModels } from '../../../types.js';
// import { Op } from 'sequelize';

// function formatMinutesToHoursMinutes(minutes: number) {
//     const hrs = Math.floor(minutes / 60);
//     const mins = minutes % 60;

//     return `${hrs}h ${mins}m`;
// }

// export const viewAttendenceSummary = async (
//     limit: number,
//     offset: number,
//     hrModels: HRModels,
//     companyId: number,
//     name,
//     status,
//     from,
//     to
// ) => {

//     try {

//         const {
//             AttendenceSummary,
//             Staff,
//             StaffShift
//         } = hrModels;

//         /* =========================
//            CURRENT MONTH
//         ========================= */

//         const now = new Date();

//         const firstDayOfMonth = new Date(
//             now.getFullYear(),
//             now.getMonth(),
//             1
//         );

//         firstDayOfMonth.setHours(0, 0, 0, 0);

//         const lastDayOfMonth = new Date(
//             now.getFullYear(),
//             now.getMonth() + 1,
//             0
//         );

//         lastDayOfMonth.setHours(
//             23,
//             59,
//             59,
//             999
//         );

//         /* =========================
//            TOTALS
//         ========================= */

//         const [
//             totalLateStaff,
//             totalPresentStaff,
//             totalHalfDayStaff
//         ] = await Promise.all([

//             AttendenceSummary.count({
//                 where: {
//                     companyId,
//                     status: 'Late',
//                     attendenceDate: {
//                         [Op.gte]: firstDayOfMonth,
//                         [Op.lte]: lastDayOfMonth
//                     }
//                 }
//             }),

//             AttendenceSummary.count({
//                 where: {
//                     companyId,
//                     status: 'Present',
//                     attendenceDate: {
//                         [Op.gte]: firstDayOfMonth,
//                         [Op.lte]: lastDayOfMonth
//                     }
//                 }
//             }),

//             AttendenceSummary.count({
//                 where: {
//                     companyId,
//                     status: 'Half Day',
//                     attendenceDate: {
//                         [Op.gte]: firstDayOfMonth,
//                         [Op.lte]: lastDayOfMonth
//                     }
//                 }
//             })
//         ]);

//         /* =========================
//            TOTAL ABSENT STAFF
//         ========================= */

//         const allStaff = await Staff.findAll({
//             where: { companyId },
//             attributes: ["id"],
//             raw: true
//         });

//         const allSummaries =
//             await AttendenceSummary.findAll({

//                 where: {
//                     companyId,
//                     attendenceDate: {
//                         [Op.gte]: firstDayOfMonth,
//                         [Op.lte]: lastDayOfMonth
//                     }
//                 },

//                 attributes: [
//                     "staffId",
//                     "attendenceDate"
//                 ],

//                 raw: true
//             });

//         /* =========================
//            GROUP PRESENT STAFF
//         ========================= */

//         const presentMap: any = {};

//         allSummaries.forEach((summary: any) => {

//             const date =
//                 new Date(summary.attendenceDate)
//                     .toISOString()
//                     .split("T")[0];

//             if (!presentMap[date]) {
//                 presentMap[date] = new Set();
//             }

//             presentMap[date]
//                 .add(summary.staffId);
//         });

//         /* =========================
//            GET ALL DATES OF MONTH
//         ========================= */

//         const dates: string[] = [];

//         for (
//             let d = new Date(firstDayOfMonth);
//             d <= lastDayOfMonth;
//             d.setDate(d.getDate() + 1)
//         ) {

//             dates.push(
//                 new Date(d)
//                     .toISOString()
//                     .split("T")[0]
//             );
//         }

//         /* =========================
//            CALCULATE ABSENT COUNT
//         ========================= */

//         let totalAbsentStaff = 0;

//         for (const currentDate of dates) {

//             const presentIds =
//                 presentMap[currentDate] || new Set();

//             const absentCount =
//                 allStaff.filter(
//                     (staff: any) =>
//                         !presentIds.has(staff.id)
//                 ).length;

//             totalAbsentStaff += absentCount;
//         }

//         /* =========================
//            FILTERS
//         ========================= */

//         const whereClause: any = {};

//         if (companyId) {
//             whereClause.companyId = companyId;
//         }

//         if (name) {
//             whereClause.staffName = {
//                 [Op.iLike]: `%${name}%`
//             };
//         }

//         if (status) {
//             whereClause.status = status;
//         }

//         if (from || to) {

//             whereClause.attendenceDate = {};

//             if (from) {

//                 const startDate =
//                     new Date(from);

//                 startDate.setHours(
//                     0,
//                     0,
//                     0,
//                     0
//                 );

//                 whereClause.attendenceDate[Op.gte]
//                     = startDate;
//             }

//             if (to) {

//                 const endDate =
//                     new Date(to);

//                 endDate.setHours(
//                     23,
//                     59,
//                     59,
//                     999
//                 );

//                 whereClause.attendenceDate[Op.lte]
//                     = endDate;
//             }
//         }

//         /* =========================
//            FETCH DATA
//         ========================= */

//         const result =
//             await AttendenceSummary.findAndCountAll({

//                 include: [
//                     {
//                         model: Staff,
//                         as: 'staff',
//                         attributes: [
//                             'fullName',
//                             'shiftId'
//                         ]
//                     }
//                 ],

//                 where: whereClause,

//                 limit,
//                 offset,

//                 order: [
//                     ['attendenceDate', 'DESC']
//                 ]
//             });

//         /* =========================
//            SHIFT DETAILS
//         ========================= */

//         const allShifts =
//             await StaffShift.findAll({

//                 attributes: [
//                     'id',
//                     'shiftName'
//                 ]
//             });

//         /* =========================
//            MAP ROWS
//         ========================= */

//         const mappedRows =
//             result.rows.map((record: any) => {

//                 const staffShiftId =
//                     record.staff.shiftId;

//                 const shift =
//                     allShifts.find(
//                         (s: any) =>
//                             s.get('id') ===
//                             staffShiftId
//                     );

//                 const shiftName =
//                     shift?.get('shiftName') || null;

//                 return {

//                     ...record.toJSON(),

//                     staffName:
//                         record.staff.fullName,

//                     shiftName,

//                     workedTime:
//                         formatMinutesToHoursMinutes(
//                             record.workedMinutes
//                         ),

//                     lateTime:
//                         formatMinutesToHoursMinutes(
//                             record.lateMinutes
//                         ),

//                     overtime:
//                         formatMinutesToHoursMinutes(
//                             record.overtimeMinutes
//                         ),

//                     status: record.status
//                 };
//             });

//         /* =========================
//            RETURN
//         ========================= */

//         return {

//             count: result.count,

//             totalLateStaff,

//             totalAbsentStaff,

//             totalPresentStaff,

//             totalHalfDayStaff,

//             rows: mappedRows
//         };

//     }
//     catch (error) {

//         console.error(
//             "Error fetching attendence summary:",
//             error
//         );

//         throw error;
//     }
// };

import { HRModels } from '../../../types.js';
import { Op } from 'sequelize';

function formatMinutesToHoursMinutes(minutes: number) {

    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hrs}h ${mins}m`;
}

export const viewAttendenceSummary = async (
    limit: number,
    offset: number,
    hrModels: HRModels,
    companyId: number,
    name,
    status,
    from,
    to
) => {

    try {

        const {
            AttendenceSummary,
            Staff,
            StaffShift,
            CompanyUserRelation
        } = hrModels;

        /* =========================
           1️⃣ GET COMPANY USERS
        ========================= */

        const companyUsers = await CompanyUserRelation.findAll({

            where: {
                companyId: companyId
            },

            attributes: ["userId"],

            raw: true
        });

        const userIds = companyUsers.map(
            (item: any) => item.userId
        );

        /* =========================
           IF NO USERS
        ========================= */

        if (userIds.length === 0) {

            return {
                count: 0,
                totalLateStaff: 0,
                totalAbsentStaff: 0,
                totalPresentStaff: 0,
                totalHalfDayStaff: 0,
                rows: []
            };
        }

        /* =========================
           CURRENT MONTH
        ========================= */

        const now = new Date();

        const firstDayOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        firstDayOfMonth.setHours(0, 0, 0, 0);

        const lastDayOfMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0
        );

        lastDayOfMonth.setHours(
            23,
            59,
            59,
            999
        );

        /* =========================
           2️⃣ TOTAL COUNTS
        ========================= */

        const [
            totalLateStaff,
            totalPresentStaff,
            totalHalfDayStaff
        ] = await Promise.all([

            AttendenceSummary.count({

                where: {

                    staffId: {
                        [Op.in]: userIds
                    },

                    status: 'Late',

                    attendenceDate: {
                        [Op.gte]: firstDayOfMonth,
                        [Op.lte]: lastDayOfMonth
                    }
                }
            }),

            AttendenceSummary.count({

                where: {

                    staffId: {
                        [Op.in]: userIds
                    },

                    status: 'Present',

                    attendenceDate: {
                        [Op.gte]: firstDayOfMonth,
                        [Op.lte]: lastDayOfMonth
                    }
                }
            }),

            AttendenceSummary.count({

                where: {

                    staffId: {
                        [Op.in]: userIds
                    },

                    status: 'Half Day',

                    attendenceDate: {
                        [Op.gte]: firstDayOfMonth,
                        [Op.lte]: lastDayOfMonth
                    }
                }
            })
        ]);

        /* =========================
           3️⃣ GET ALL STAFF
        ========================= */

        const allStaff = await Staff.findAll({

            where: {

                id: {
                    [Op.in]: userIds
                }
            },

            attributes: ["id"],

            raw: true
        });

        /* =========================
           4️⃣ GET MONTH SUMMARIES
        ========================= */

        const allSummaries =
            await AttendenceSummary.findAll({

                where: {

                    staffId: {
                        [Op.in]: userIds
                    },

                    attendenceDate: {
                        [Op.gte]: firstDayOfMonth,
                        [Op.lte]: lastDayOfMonth
                    }
                },

                attributes: [
                    "staffId",
                    "attendenceDate"
                ],

                raw: true
            });

        /* =========================
           5️⃣ PRESENT MAP
        ========================= */

        const presentMap: any = {};

        allSummaries.forEach((summary: any) => {

            const date =
                new Date(summary.attendenceDate)
                    .toISOString()
                    .split("T")[0];

            if (!presentMap[date]) {

                presentMap[date] = new Set();
            }

            presentMap[date]
                .add(summary.staffId);
        });

        /* =========================
           6️⃣ ALL DATES OF MONTH
        ========================= */

        const dates: string[] = [];

        for (
            let d = new Date(firstDayOfMonth);
            d <= lastDayOfMonth;
            d.setDate(d.getDate() + 1)
        ) {

            dates.push(
                new Date(d)
                    .toISOString()
                    .split("T")[0]
            );
        }

        /* =========================
           7️⃣ ABSENT COUNT
        ========================= */

        let totalAbsentStaff = 0;

        for (const currentDate of dates) {

            const presentIds =
                presentMap[currentDate] || new Set();

            const absentCount =
                allStaff.filter(
                    (staff: any) =>
                        !presentIds.has(staff.id)
                ).length;

            totalAbsentStaff += absentCount;
        }

        /* =========================
           8️⃣ FILTERS
        ========================= */

        const whereClause: any = {

            staffId: {
                [Op.in]: userIds
            }
        };

        if (status) {

            whereClause.status = status;
        }

        if (from || to) {

            whereClause.attendenceDate = {};

            if (from) {

                const startDate =
                    new Date(from);

                startDate.setHours(
                    0,
                    0,
                    0,
                    0
                );

                whereClause.attendenceDate[Op.gte]
                    = startDate;
            }

            if (to) {

                const endDate =
                    new Date(to);

                endDate.setHours(
                    23,
                    59,
                    59,
                    999
                );

                whereClause.attendenceDate[Op.lte]
                    = endDate;
            }
        }

        /* =========================
           STAFF FILTER
        ========================= */

        const staffWhere: any = {};

        if (name) {

            staffWhere.fullName = {
                [Op.iLike]: `%${name}%`
            };
        }

        /* =========================
           9️⃣ FETCH DATA
        ========================= */

        const result =
            await AttendenceSummary.findAndCountAll({

                include: [
                    {
                        model: Staff,
                        as: 'staff',

                        attributes: [
                            'fullName',
                            'shiftId'
                        ],

                        where: staffWhere
                    }
                ],

                where: whereClause,

                limit,
                offset,

                order: [
                    ['attendenceDate', 'DESC']
                ]
            });

        /* =========================
           🔟 SHIFT DETAILS
        ========================= */

        const allShifts =
            await StaffShift.findAll({

                attributes: [
                    'id',
                    'shiftName'
                ]
            });

        /* =========================
           1️⃣1️⃣ MAP ROWS
        ========================= */

        const mappedRows =
            result.rows.map((record: any) => {

                const staffShiftId =
                    record.staff?.shiftId;

                const shift =
                    allShifts.find(
                        (s: any) =>
                            s.get('id') ===
                            staffShiftId
                    );

                const shiftName =
                    shift?.get('shiftName') || null;

                return {

                    ...record.toJSON(),

                    staffName:
                        record.staff?.fullName || null,

                    shiftName,

                    workedTime:
                        formatMinutesToHoursMinutes(
                            record.workedMinutes || 0
                        ),

                    lateTime:
                        formatMinutesToHoursMinutes(
                            record.lateMinutes || 0
                        ),

                    overtime:
                        formatMinutesToHoursMinutes(
                            record.overtimeMinutes || 0
                        ),

                    status: record.status
                };
            });

        /* =========================
           FINAL RETURN
        ========================= */

        return {

            count: result.count,

            totalLateStaff,

            totalAbsentStaff,

            totalPresentStaff,

            totalHalfDayStaff,

            rows: mappedRows
        };

    } catch (error) {

        console.error(
            "Error fetching attendence summary:",
            error
        );

        throw error;
    }
};