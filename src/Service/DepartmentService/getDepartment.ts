import { Op } from "sequelize";

export async function getDepartments(limit, offset, companyId, hrModel, status, name) {
    try {
        const { Department, Staff } = hrModel;
        const whereClause: any = {};
        if (companyId) {
            whereClause.companyId = companyId;
        }
        if (status) {
            whereClause.status = status;
        }
        if (name) {
            whereClause.name = {
                [Op.iLike]: `%${name}%`
            };
        }
        const departments = await Department.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Staff,
                    attributes: ['id', 'fullName'],
                    as: "staffs",
                    required: false
                }
            ],
            distinct: true,
            limit,
            offset,
            order: [['id', 'ASC']],
        });

        const rows = departments.rows.map(dept => ({
            ...dept.toJSON(),
            employeeCount: dept.staffs.length
        }));

        // `count` is an array when using group, so get its length for total count
        return {
            count: departments.count,
            rows
        }
    } catch (error) {
        return error;
    }
}
