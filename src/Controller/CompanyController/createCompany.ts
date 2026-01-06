import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import * as companyService from "../../Service/CompanyService/createCompany.js";

export const createCompany = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const company = await companyService.createCompany(req.body, hrModels);
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}