import { Op } from "sequelize";
import moment from "moment";
import { updateAttendanceSummary } from "../../../utils/attendenceLogic.js";

// export const updatePunch = async (
//     id,
//     date,
//     SummaryModel,
//     PunchingModel,
//     updatedPunches // 👈 IMPORTANT: from user input
// ) => {

//     // 1️⃣ Get attendance summary
//     const summary = await SummaryModel.findByPk(id);

//     if (!summary) {
//         throw new Error("Attendance not found");
//     }

//     const staffId = summary.staffId;

//     // 2️⃣ Build date range (whole day)
//     const startOfDay = moment(date).startOf("day").toDate();
//     const endOfDay = moment(date).endOf("day").toDate();

//     // 3️⃣ DELETE punches ONLY for that staff + date
//     // await PunchingModel.destroy({
//     //     where: {
//     //         staffId,
//     //         eventDate: {
//     //             [Op.between]: [startOfDay, endOfDay]
//     //         }
//     //     }
//     // });

//     // 4️⃣ INSERT NEW punches
//     const newPunches = updatedPunches.map(p => ({
//         staffId,
//         eventDate: moment(p.eventDate).toDate()
//     }));

//     await PunchingModel.bulkCreate(newPunches);

//     return {
//         success: true,
//         message: "Punches updated successfully",
//         inserted: newPunches.length
//     };
// };

// type Punch = {
//     eventDate: string;
// };

// export const updatePunch = async (
//     id,
//     date,
//     SummaryModel,
//     PunchingModel,
//     updatedPunches: Punch[],
//     sequelize
// ) => {

//     const transaction = await sequelize.transaction();

//     try {
//         const summary = await SummaryModel.findByPk(id, { transaction });

//         if (!summary) throw new Error("Attendance not found");

//         const staffId = summary.staffId;

//         const startOfDay = moment(date).startOf("day").toDate();
//         const endOfDay = moment(date).endOf("day").toDate();

//         await PunchingModel.destroy({
//             where: {
//                 staffId,
//                 eventDate: {
//                     [Op.between]: [startOfDay, endOfDay]
//                 }
//             },
//             transaction
//         });

//         // ✅ 1. CLEAN INPUT
//         const cleaned = updatedPunches
//             .map(p => ({
//                 eventDate: moment(p.eventDate, "YYYY-MM-DD HH:mm", true)
//             }))
//             .filter(p => p.eventDate.isValid());

//         // ✅ 2. REMOVE DUPLICATES
//         const unique = Array.from(
//             new Map(
//                 cleaned.map(p => [p.eventDate.toISOString(), p])
//             ).values()
//         );

//         // ✅ 3. SORT
//         unique.sort(
//             (a, b) => a.eventDate.valueOf() - b.eventDate.valueOf()
//         );

//         // ✅ 4. FINAL INSERT
//         const newPunches = unique.map(p => ({
//             staffId,
//             eventDate: p.eventDate.toDate()
//         }));

//         await PunchingModel.bulkCreate(newPunches, { transaction });

//         await transaction.commit();

//         return {
//             success: true,
//             inserted: newPunches.length
//         };

//     } catch (err) {
//         await transaction.rollback();
//         throw err;
//     }
// };

export const updatePunch = async (
    id,
    date,
    hrModels,
    updatedPunches
) => {
    const { AttendenceSummary, Punching } = hrModels;
    const summary = await AttendenceSummary.findByPk(id);
    if (!summary) throw new Error("Attendance not found");

    const staffId = summary.staffId;

    const startOfDay = moment(date).startOf("day").toDate();
    const endOfDay = moment(date).endOf("day").toDate();

    // 1️⃣ GET OLD PUNCHES (important: keep IDs)
    const oldPunches = await Punching.findAll({
        where: {
            staffId,
            eventDate: {
                [Op.between]: [startOfDay, endOfDay]
            }
        }
    });

    const oldIds = oldPunches.map(p => p.id);

    // 2️⃣ PREP NEW PUNCHES
    // const newPunches = updatedPunches.map(p => ({
    //     staffId,
    //     eventDate: moment(p.eventDate, "YYYY-MM-DD HH:mm").toDate()
    // }));
    const newPunches = updatedPunches
        .map(p => ({
            staffId,
            eventDate: moment(
                p.eventDate,
                "YYYY-MM-DD HH:mm",
                true
            )
        }))
        .filter(p => p.eventDate.isValid())
        .map(p => ({
            staffId: p.staffId,
            eventDate: p.eventDate.toDate()
        }));

    // 3️⃣ INSERT NEW FIRST
    const inserted = await Punching.bulkCreate(newPunches);

    // 4️⃣ DELETE ONLY OLD ONES (by ID — SAFE)
    await Punching.destroy({
        where: {
            id: {
                [Op.in]: oldIds
            }
        }
    });
    const finalPunches = await Punching.findAll({
        where: {
            staffId,
            eventDate: {
                [Op.between]: [startOfDay, endOfDay]
            }
        },
        order: [["eventDate", "ASC"]]
    });
    console.log(finalPunches);

    await updateAttendanceSummary(finalPunches, hrModels);
    return {
        success: true,
        message: "Punch updated safely (old replaced)",
        inserted: inserted.length,
        deleted: oldIds.length
    };
};