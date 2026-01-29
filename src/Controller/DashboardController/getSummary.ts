import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import * as dashboardService from "../../Service/DashboardService/getSummary.js";

export const getSummary = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const companyId = parseInt(req.params.id);
        const document = await dashboardService.getSummary(hrModels, companyId);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}