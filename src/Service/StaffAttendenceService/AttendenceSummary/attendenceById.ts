import { Op } from "sequelize";
export const attendenceById = async (id, Attendence) => {
    const result = await Attendence.findOne({
        where: { id },
    });
    return result;
};
