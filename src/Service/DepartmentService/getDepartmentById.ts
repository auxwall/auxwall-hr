import { Op } from "sequelize";
export const getDepartmentById = async (id, Department) => {
    const result = await Department.findOne({
        where: { id },
    });
    return result;
};
