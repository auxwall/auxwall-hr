import { HRModels } from '../../../types.js';
import { Request, Response } from 'express';
import * as attendanceSummaryService from "../../../Service/StaffAttendenceService/AttendenceSummary/viewAttendenceSummary.js"
import { getPagination, getPaginationResponse } from "../../../utils/pagination.js"

export const viewAttendenceSummary = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const { page, size } = req.query;
        const { limit, offset } = getPagination(page, size);
        const result = await attendanceSummaryService.viewAttendenceSummary(limit, offset, hrModels);
        const response = getPaginationResponse(result, page, limit);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching attendence summary:", error);
        res.status(500).json({ error: "Failed to fetch attendence summary" });
    }
}