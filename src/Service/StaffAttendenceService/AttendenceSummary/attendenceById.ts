// import { Op } from "sequelize";
// export const attendenceById = async (id, date, SummaryModel, PunchingModel) => {
//     const result = await SummaryModel.findOne({
//         where: { id },
//     });
//     return result;
// };
import { Op } from "sequelize";
import moment from "moment";

export const attendenceById = async (
    id,
    date,
    SummaryModel,
    PunchingModel
) => {

    // 1️⃣ Get attendance summary
    const result = await SummaryModel.findOne({
        where: { id }
    });

    if (!result) {
        throw new Error("Attendance not found");
    }

    const staffId = result.staffId;

    // 2️⃣ Build date range
    const startOfDay = moment(date).startOf("day").toDate();
    const endOfDay = moment(date).endOf("day").toDate();

    // 3️⃣ Get punches for that staff on that date
    const punches = await PunchingModel.findAll({
        where: {
            staffId,
            eventDate: {
                [Op.between]: [startOfDay, endOfDay]
            }
        },
        order: [["eventDate", "ASC"]]
    });
    // 4️⃣ Convert summary time fields to LOCAL time
    const attendance = {
        ...result.toJSON(),
        // first_in: result.first_in
        //     ? moment.utc(result.first_in).local().format("HH:mm:ss")
        //     : null,

        // last_out: result.last_out
        //     ? moment.utc(result.last_out).local().format("HH:mm:ss")
        //     : null
        first_in: result.first_in
            ? moment.utc(result.first_in, "HH:mm:ss", true).local().format("HH:mm:ss")
            : null,

        last_out: result.last_out
            ? moment.utc(result.last_out, "HH:mm:ss", true).local().format("HH:mm:ss")
            : null
    };

    // 5️⃣ Convert punches to LOCAL time
    const formattedPunches = punches.map(p => ({
        ...p.toJSON(),
        eventDate: moment.utc(p.eventDate).local().format("YYYY-MM-DD HH:mm:ss"),
        eventTime: moment.utc(p.eventDate).local().format("HH:mm")
    }));

    const inPunches = [];
    const outPunches = [];

    formattedPunches.forEach((p, index) => {
        if (index % 2 === 0) {
            inPunches.push(p);
        } else {
            outPunches.push(p);
        }
    });

    // 6️⃣ return final response
    return {
        attendance,
        punches: formattedPunches,
        inPunches,
        outPunches
    };
};
