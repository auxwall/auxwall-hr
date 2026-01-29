import { Op } from "sequelize";
export const viewShiftById = async (shiftId, staffShift, Department) => {
    const whereClause: any = {};

    if (shiftId) {
        whereClause.id = shiftId;
    }
    const result = await staffShift.findOne({
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
