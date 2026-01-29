import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import * as dashboardService from "../../Service/DashboardService/getHrDashboard.js";

export const getHrDashboard = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const id = req.params.id;
        const document = await dashboardService.getHrDashboard(hrModels, id);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}