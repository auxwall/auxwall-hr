import { Company } from "../../models/index.js";

export async function getCompany(limit, offset) {
    const company = await Company.findAndCountAll({
        limit,
        offset,
        order: [
            ['id', 'DESC']
        ]
    });
    return company;
}