import { HRModels } from '../../types.js';
export async function getStaff(limit, offset, hrModels) {
    const staff = await hrModels.Staff.findAndCountAll({
        limit,
        offset,
        order: [
            ['staffId', 'DESC']
        ]
    });
    return staff;
}