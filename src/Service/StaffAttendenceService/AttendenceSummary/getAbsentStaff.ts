// import moment from "moment";
// import { Op } from "sequelize";

// export const getAbsentStaffService = async (limit,
//     offset,
//     from,
//     to,
//     name,
//     hrModels) => {
//     const {
//         Staff,
//         AttendenceSummary,
//         Schedule,
//         StaffShift
//     } = hrModels;

//     /* =========================
//        1️⃣ GET ALL DATES OR SINGLE DATE
//     ========================= */
//     // let summaryWhere: any = {};

//     // if (date) {
//     //     summaryWhere.attendenceDate = moment(date).format("YYYY-MM-DD");
//     // }

//     let summaryWhere: any = {};

//     if (from && to) {
//         summaryWhere.attendenceDate = {
//             [Op.between]: [
//                 moment(from).format("YYYY-MM-DD"),
//                 moment(to).format("YYYY-MM-DD")
//             ]
//         };
//     }
//     else if (from) {
//         summaryWhere.attendenceDate =
//             moment(from).format("YYYY-MM-DD");
//     }
//     let staffWhere: any = {};

//     if (name) {
//         staffWhere.fullName = {
//             [Op.iLike]: `%${name}%`
//         };
//     }

//     const allSummaries: any[] = await AttendenceSummary.findAll({
//         where: summaryWhere,
//         attributes: ["staffId", "attendenceDate"],
//         raw: true
//     });

//     // if (!allSummaries.length) return [];
//     if (!allSummaries.length) {
//         return {
//             count: 0,
//             rows: []
//         };
//     }
//     /* =========================
//        2️⃣ GROUP PRESENT BY DATE
//     ========================= */
//     const presentMap = {};

//     allSummaries.forEach(s => {
//         if (!presentMap[s.attendenceDate]) {
//             presentMap[s.attendenceDate] = new Set();
//         }
//         presentMap[s.attendenceDate].add(s.staffId);
//     });

//     /* =========================
//        3️⃣ GET ALL STAFF
//     ========================= */
//     const allStaff = await Staff.findAll({
//         where: staffWhere,
//         attributes: ["id", "fullName", "scheduleId", "shiftId"],
//         raw: true
//     });

//     const result = [];

//     /* =========================
//        4️⃣ LOOP EACH DATE
//     ========================= */
//     // const dates = Object.keys(presentMap);
//     const dates = Object.keys(presentMap).sort(
//         (a, b) => moment(b).valueOf() - moment(a).valueOf()
//     );

//     for (const currentDate of dates) {

//         const presentIds = presentMap[currentDate];

//         const absentStaff = allStaff.filter(
//             s => !presentIds.has(s.id)
//         );

//         /* =========================
//            5️⃣ BUILD SHIFT INFO
//         ========================= */
//         for (const staff of absentStaff) {

//             let shiftName = null;
//             let shiftStart = null;
//             let shiftEnd = null;

//             const schedule = await Schedule.findOne({
//                 where: { id: staff.scheduleId },
//                 raw: true
//             });

//             let staffShiftId = null;

//             if (schedule?.data) {
//                 const dayKey = moment(currentDate).format("ddd");
//                 staffShiftId = schedule.data?.[dayKey] || null;
//             }

//             const shiftId = staffShiftId || staff.shiftId;

//             if (shiftId) {
//                 const shift = await StaffShift.findByPk(shiftId, {
//                     raw: true
//                 });

//                 if (shift) {
//                     shiftName = shift.shiftName;
//                     shiftStart = shift.shiftStart;
//                     shiftEnd = shift.shiftEnd;
//                 }
//             }

//             result.push({
//                 staffId: staff.id,
//                 fullName: staff.fullName,
//                 date: currentDate,
//                 shiftName,
//                 shiftStart,
//                 shiftEnd,
//                 status: "Absent"
//             });
//         }
//     }
//     const paginatedRows = result.slice(
//         offset,
//         offset + limit
//     );
//     return {
//         count: result.length,
//         rows: paginatedRows
//     };
// }
import moment from "moment";
import { Op } from "sequelize";

export const getAbsentStaffService = async (
    limit,
    offset,
    from,
    to,
    name,
    hrModels
) => {

    const {
        Staff,
        AttendenceSummary,
        Schedule,
        StaffShift
    } = hrModels;

    /* =========================
       1️⃣ SUMMARY FILTER
    ========================= */
    let summaryWhere: any = {};

    if (from && to) {
        summaryWhere.attendenceDate = {
            [Op.between]: [
                moment(from).format("YYYY-MM-DD"),
                moment(to).format("YYYY-MM-DD")
            ]
        };
    }
    else if (from) {
        summaryWhere.attendenceDate =
            moment(from).format("YYYY-MM-DD");
    }

    /* =========================
       2️⃣ STAFF FILTER
    ========================= */
    let staffWhere: any = {};

    if (name) {
        staffWhere.fullName = {
            [Op.iLike]: `%${name}%`
        }
    }

    /* =========================
       3️⃣ GET STAFF
    ========================= */
    const allStaff = await Staff.findAll({
        where: staffWhere,
        attributes: [
            "id",
            "fullName",
            "scheduleId",
            "shiftId"
        ],
        raw: true
    });

    if (!allStaff.length) {
        return {
            count: 0,
            rows: []
        };
    }



    /* =========================
       5️⃣ GET ATTENDANCE SUMMARY
    ========================= */
    const allSummaries = await AttendenceSummary.findAll({
        where: summaryWhere,
        attributes: [
            "staffId",
            "attendenceDate"
        ],
        raw: true
    });

    if (!allSummaries.length) {
        return {
            count: 0,
            rows: []
        };
    }

    /* =========================
       6️⃣ GROUP PRESENT STAFF
    ========================= */
    const presentMap = {};

    allSummaries.forEach(summary => {

        // only include searched staff
        // if (!filteredStaffIds.has(summary.staffId)) {
        //     return;
        // }


        if (!presentMap[summary.attendenceDate]) {
            presentMap[summary.attendenceDate] = new Set();
        }

        presentMap[summary.attendenceDate]
            .add(summary.staffId);
    });

    /* =========================
       7️⃣ SORT DATES DESC
    ========================= */
    const dates = Object.keys(presentMap).sort(
        (a, b) =>
            moment(b).valueOf() -
            moment(a).valueOf()
    );

    const result = [];

    /* =========================
       8️⃣ FIND ABSENT STAFF
    ========================= */
    for (const currentDate of dates) {

        const presentIds =
            presentMap[currentDate] || new Set();

        const absentStaff = allStaff.filter(
            staff => !presentIds.has(staff.id)
        );

        /* =========================
           9️⃣ SHIFT DETAILS
        ========================= */
        for (const staff of absentStaff) {

            let shiftName = null;
            let shiftStart = null;
            let shiftEnd = null;

            const schedule = await Schedule.findOne({
                where: {
                    id: staff.scheduleId
                },
                raw: true
            });

            let staffShiftId = null;

            if (schedule?.data) {

                const dayKey =
                    moment(currentDate).format("ddd");

                staffShiftId =
                    schedule.data?.[dayKey] || null;
            }

            const shiftId =
                staffShiftId || staff.shiftId;

            if (shiftId) {

                const shift =
                    await StaffShift.findByPk(
                        shiftId,
                        { raw: true }
                    );

                if (shift) {

                    shiftName = shift.shiftName;
                    shiftStart = shift.shiftStart;
                    shiftEnd = shift.shiftEnd;
                }
            }

            result.push({
                staffId: staff.id,
                fullName: staff.fullName,
                date: currentDate,
                shiftName,
                shiftStart,
                shiftEnd,
                status: "Absent"
            });
        }
    }

    /* =========================
       🔟 PAGINATION
    ========================= */
    const paginatedRows = result.slice(
        offset,
        offset + limit
    );

    return {
        count: result.length,
        rows: paginatedRows
    };
};