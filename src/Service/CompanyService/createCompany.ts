import { HRModels } from '../../types.js';
export async function createCompany(company, hrModels) {
    const newCompany = await hrModels.Company.create(company);
    return newCompany;
}
