export async function createCompany(company, hrModels) {
    const newCompany = await hrModels.Company.create(company);
    return newCompany;
}
