import * as companyService from "../../Service/CompanyService/createCompany.js";

export const createCompany = async (req, res, hrModels) => {
    try {
        const company = await companyService.createCompany(req.body, hrModels);
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}