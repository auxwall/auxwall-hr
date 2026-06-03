// import { Op } from "sequelize";

// export const viewShifts = async (
//     limit,
//     offset,
//     Schedule,
//     staffShift,
//     Department,
//     Staff,
//     CompanyUserRelation,
//     companyId,
//     departmentId,
//     name
// ) => {

//     /* =========================
//        1️⃣ GET COMPANY USERS
//     ========================= */

//     const companyUsers = await CompanyUserRelation.findAll({
//         where: { companyId },
//         attributes: ["userId"],
//         raw: true
//     });

//     const userIds = companyUsers
//         .map((item: any) => item.userId)
//         .filter(Boolean);

//     /* =========================
//        IF NO USERS
//     ========================= */

//     if (userIds.length === 0) {
//         return {
//             count: 0,
//             rows: []
//         };
//     }

//     /* =========================
//        STAFF FILTER
//     ========================= */

//     const whereClause: any = {
//         id: {
//             [Op.in]: userIds
//         }
//     };

//     if (name) {
//         whereClause.fullName = {
//             [Op.iLike]: `%${name}%`
//         };
//     }

//     if (departmentId) {
//         whereClause.departmentId = departmentId;
//     }

//     /* =========================
//        MAIN QUERY
//     ========================= */

//     const result = await Staff.findAndCountAll({
//         limit,
//         offset,

//         where: whereClause,

//         attributes: [
//             "id",
//             "fullName",
//             "shiftId",
//             "scheduleId",
//             "departmentId"
//         ],

//         include: [

//             // Shift Details
//             {
//                 model: staffShift,
//                 as: "shift",
//                 attributes: [
//                     "id",
//                     "shiftName",
//                     "departmentId"
//                 ],

//                 include: [
//                     {
//                         model: Department,
//                         as: "department",
//                         attributes: ["id", "name"]
//                     }
//                 ]
//             },

//             // Schedule Details
//             {
//                 model: Schedule,
//                 as: "schedule",
//                 attributes: [
//                     "id",
//                     "name",
//                     "type",
//                     "data"
//                 ]
//             }
//         ],
//         // include: [

//         //     // SHIFT
//         //     {
//         //         model: staffShift,
//         //         as: "shift",
//         //         attributes: ["id", "shiftName", "shiftStart", "shiftEnd", "departmentId"],

//         //         include: [
//         //             {
//         //                 model: Department,
//         //                 as: "department",
//         //                 attributes: ["id", "name"]
//         //             },

//         //             // SHIFT → SCHEDULES
//         //             {
//         //                 model: Schedule,
//         //                 as: "schedules",
//         //                 attributes: [
//         //                     "id",
//         //                     "name",
//         //                     "type",
//         //                     "data"
//         //                 ],

//         //                 include: [
//         //                     {
//         //                         model: staffShift,
//         //                         as: "shift",   // 👈 schedule's shift details again
//         //                         attributes: ["id", "shiftName"]
//         //                     }
//         //                 ]
//         //             }
//         //         ]
//         //     },

//         //     // (optional) direct schedule on staff
//         //     {
//         //         model: Schedule,
//         //         as: "schedule",
//         //         attributes: ["id", "name", "type", "data"]
//         //     }
//         // ],
//         order: [["id", "ASC"]]
//     });

//     return result;
// };
// import { Op } from "sequelize";

// export const viewShifts = async (
//     limit,
//     offset,
//     Schedule,
//     staffShift,
//     Department,
//     Staff,
//     CompanyUserRelation,
//     companyId,
//     departmentId,
//     name
// ) => {

//     /* =========================
//        1️⃣ GET COMPANY USERS
//     ========================= */

//     const companyUsers = await CompanyUserRelation.findAll({
//         where: { companyId },
//         attributes: ["userId"],
//         raw: true
//     });

//     const userIds = companyUsers
//         .map((item: any) => item.userId)
//         .filter(Boolean);

//     if (userIds.length === 0) {
//         return {
//             count: 0,
//             rows: []
//         };
//     }

//     /* =========================
//        2️⃣ STAFF FILTER
//     ========================= */

//     const whereClause: any = {
//         id: {
//             [Op.in]: userIds
//         }
//     };

//     if (name) {
//         whereClause.fullName = {
//             [Op.iLike]: `%${name}%`
//         };
//     }

//     if (departmentId) {
//         whereClause.departmentId = departmentId;
//     }

//     /* =========================
//        3️⃣ MAIN QUERY
//     ========================= */

//     const result = await Staff.findAndCountAll({
//         limit,
//         offset,

//         where: whereClause,

//         attributes: [
//             "id",
//             "fullName",
//             "shiftId",
//             "departmentId"
//         ],

//         // include: [
//         //     {
//         //         model: staffShift,
//         //         as: "shift",
//         //         attributes: [
//         //             "id",
//         //             "shiftName",
//         //             "shiftStart",
//         //             "shiftEnd",
//         //             "departmentId"
//         //         ],

//         //         include: [
//         //             {
//         //                 model: Department,
//         //                 as: "department",
//         //                 attributes: ["id", "name"]
//         //             },

//         //             {
//         //                 model: Schedule,
//         //                 as: "schedules",
//         //                 attributes: [
//         //                     "id",
//         //                     "name",
//         //                     "type",
//         //                     "data"
//         //                 ]
//         //             }
//         //         ]
//         //     }
//         // ],
//         include: [
//             {
//                 model: staffShift,
//                 as: "shift",
//                 required: false,

//                 attributes: [
//                     "id",
//                     "shiftName",
//                     "shiftStart",
//                     "shiftEnd",
//                     "departmentId"
//                 ],

//                 include: [
//                     {
//                         model: Department,
//                         as: "department",
//                         required: false,
//                         attributes: ["id", "name"]
//                     },

//                     {
//                         model: Schedule,
//                         as: "schedules",
//                         required: false,
//                         attributes: [
//                             "id",
//                             "name",
//                             "type",
//                             "data"
//                         ]
//                     }
//                 ]
//             }
//         ],

//         order: [["id", "ASC"]]
//     });

//     /* =========================
//        4️⃣ SHIFT LOOKUP MAP
//     ========================= */

//     const allShifts = await staffShift.findAll({
//         attributes: [
//             "id",
//             "shiftName",
//             "shiftStart",
//             "shiftEnd",
//             "departmentId"
//         ],
//         raw: true
//     });

//     const shiftMap = new Map();
//     allShifts.forEach((s: any) => {
//         shiftMap.set(s.id, s);
//     });

//     /* =========================
//        5️⃣ TRANSFORM + FIX CIRCULAR ERROR
//     ========================= */

//     const rows = result.rows.map((staff: any) => {

//         // ✅ IMPORTANT: remove Sequelize instance
//         const plainStaff = staff.toJSON();

//         const shift = plainStaff.shift;

//         const schedules = shift?.schedules?.map((sch: any) => {

//             const data = sch.data || {};

//             const transformedData: any = {};

//             for (const day in data) {

//                 const shiftId = data[day];

//                 transformedData[day] =
//                     shiftMap.get(shiftId) || null;
//             }

//             return {
//                 id: sch.id,
//                 name: sch.name,
//                 type: sch.type,
//                 data: transformedData
//             };
//         });

//         return {
//             id: plainStaff.id,
//             fullName: plainStaff.fullName,
//             shiftId: plainStaff.shiftId,
//             departmentId: plainStaff.departmentId,

//             shift: shift
//                 ? {
//                     ...shift,
//                     schedules
//                 }
//                 : null
//         };
//     });

//     /* =========================
//        6️⃣ FINAL RESPONSE
//     ========================= */

//     return {
//         count: result.count,
//         rows
//     };
// };
import { Op } from "sequelize";

export const viewShifts = async (
    limit,
    offset,
    Schedule,
    staffShift,
    Department,
    Staff,
    CompanyUserRelation,
    companyId,
    departmentId,
    name
) => {

    /* =========================
       1️⃣ GET COMPANY USERS
    ========================= */

    const companyUsers = await CompanyUserRelation.findAll({
        where: { companyId },
        attributes: ["userId"],
        raw: true
    });

    const userIds = companyUsers
        .map((item: any) => item.userId)
        .filter(Boolean);

    /* =========================
       IF NO USERS
    ========================= */

    if (userIds.length === 0) {
        return {
            count: 0,
            rows: []
        };
    }

    /* =========================
       STAFF FILTER
    ========================= */

    const whereClause: any = {
        id: {
            [Op.in]: userIds
        }
    };

    if (name) {
        whereClause.fullName = {
            [Op.iLike]: `%${name}%`
        };
    }

    if (departmentId) {
        whereClause.departmentId = departmentId;
    }

    /* =========================
       GET ALL SHIFTS
    ========================= */

    const allShifts = await staffShift.findAll({
        attributes: [
            "id",
            "shiftName",
            "shiftStart",
            "shiftEnd",
            "departmentId"
        ],
        raw: true
    });

    /* =========================
       CREATE SHIFT MAP
    ========================= */

    const shiftMap = new Map();

    allShifts.forEach((shift: any) => {
        shiftMap.set(shift.id, {
            shiftId: shift.id,
            shiftName: shift.shiftName,
            shiftStart: shift.shiftStart,
            shiftEnd: shift.shiftEnd,
            departmentId: shift.departmentId
        });
    });

    /* =========================
       MAIN QUERY
    ========================= */

    const result = await Staff.findAndCountAll({
        limit,
        offset,

        where: whereClause,

        attributes: [
            "id",
            "fullName",
            "shiftId",
            "scheduleId",
            "departmentId"
        ],

        include: [

            // SHIFT
            {
                model: staffShift,
                as: "shift",
                attributes: [
                    "id",
                    "shiftName",
                    "shiftStart",
                    "shiftEnd",
                    "departmentId"
                ],

                include: [
                    {
                        model: Department,
                        as: "department",
                        attributes: ["id", "name"]
                    }
                ]
            },

            // SCHEDULE
            {
                model: Schedule,
                as: "schedule",
                attributes: [
                    "id",
                    "name",
                    "type",
                    "data"
                ]
            }
        ],

        order: [["id", "ASC"]]
    });

    /* =========================
       TRANSFORM RESPONSE
    ========================= */

    const rows = result.rows.map((staff: any) => {

        const plainStaff = staff.toJSON();

        /* =========================
           TRANSFORM SCHEDULE DATA
        ========================= */

        let transformedSchedule = null;

        if (plainStaff.schedule) {

            const rawData =
                typeof plainStaff.schedule.data === "string"
                    ? JSON.parse(plainStaff.schedule.data)
                    : plainStaff.schedule.data || {};

            const transformedData: any = {};

            for (const key in rawData) {

                const shiftId = rawData[key];

                transformedData[key] =
                    shiftId
                        ? shiftMap.get(shiftId) || null
                        : null;
            }

            transformedSchedule = {
                ...plainStaff.schedule,
                data: transformedData
            };
        }

        return {
            ...plainStaff,
            schedule: transformedSchedule
        };
    });

    /* =========================
       FINAL RESPONSE
    ========================= */

    return {
        count: result.count,
        rows
    };
};