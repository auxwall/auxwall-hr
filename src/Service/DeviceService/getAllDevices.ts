import { Op } from "sequelize";

export async function getAllDevices(limit, offset, companyId, hrModel, status, name) {
    try {
        const { Device, Company, Staff } = hrModel;
        const whereClause: any = {};
        if (companyId) {
            whereClause.companyId = companyId;
        }
        if (status) {
            whereClause.status = status;
        }
        if (name) {
            whereClause.deviceName = {
                [Op.iLike]: `%${name}%`
            };
        }
        const devices = await Device.findAndCountAll({
            where: whereClause,
            distinct: true,
            limit,
            offset,
            order: [['id', 'ASC']],
            // include: [
            //     {
            //         model: Company,
            //         as: 'ownerCompany'
            //     },
            //     {
            //         model: Staff,
            //         as: 'createdBy',
            //         attributes: ['id', 'firstName', 'lastName']
            //     }
            // ]
        });

        return {
            count: devices.count,
            rows: devices.rows
        }
    } catch (error) {
        return error;
    }
}
