import * as companyService from "../../Service/CompanyService/getCompany.js";
import { getPagination, getPaginationResponse } from "../../utils/pagination.js";

export const getCompany = async (req, res, hrModels) => {
    try {
        const { page, size } = req.query;
        const { limit, offset } = getPagination(page, size);
        const company = await companyService.getCompany(limit, offset, hrModels);
        const response = getPaginationResponse(company, page, limit);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}