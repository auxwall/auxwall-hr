import { Op } from "sequelize";
export const viewAllShifts = async (staffShift, Department, companyId, departmentId, name) => {
    const whereClause: any = {};
    if (companyId) {
        whereClause.companyId = companyId;
    }
    if (departmentId) {
        whereClause.departmentId = departmentId;
    }
    if (name) {
        whereClause.shiftName = { [Op.iLike]: `%${name}%` };
    }
    const result = await staffShift.findAndCountAll({
        where: whereClause,
        include: [
            {
                model: Department,
                as: 'department',
                attributes: ['id', 'name']
            }
        ],
        order: [['id', 'ASC']]
    });
    return result;
};
