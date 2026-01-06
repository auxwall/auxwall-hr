import { HRModels } from '../../types.js';
export async function getCompany(limit, offset, hrModels) {
    const company = await hrModels.Company.findAndCountAll({
        limit,
        offset,
        order: [
            ['companyId', 'DESC']
        ]
    });
    return company;
}