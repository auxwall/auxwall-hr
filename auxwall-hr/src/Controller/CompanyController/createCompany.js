import * as companyService from "../../Service/CompanyService/createCompany.js";

export const createCompany = async (req, res) => {
    try {
        const company = await companyService.createCompany(req.body);
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}