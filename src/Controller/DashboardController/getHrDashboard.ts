import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import * as dashboardService from "../../Service/DashboardService/getHrDashboard.js";

export const getHrDashboard = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const document = await dashboardService.getHrDashboard(hrModels);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}