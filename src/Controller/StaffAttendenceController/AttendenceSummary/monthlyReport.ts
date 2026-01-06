import { HRModels } from '../../../types.js';
import { Request, Response } from 'express';
import * as attendanceSummaryService from "../../../Service/StaffAttendenceService/AttendenceSummary/monthlyReport.js"

export const monthlyReport = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const { year, month } = req.query;
        const result = await attendanceSummaryService.monthlyReport(hrModels, year, month);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching monthly report:", error);
        res.status(500).json({ error: "Failed to fetch monthly report" });
    }
}