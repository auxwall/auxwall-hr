import { Company } from "../models/index.js";
export async function createCompany(company) {
    const newCompany = await Company.create(company);
    return newCompany;
}
export async function getCompany() {
    const company = await Company.findAll();
    return company;
}