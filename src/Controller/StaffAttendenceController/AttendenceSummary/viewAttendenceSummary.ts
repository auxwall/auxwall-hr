import { HRModels } from '../../../types.js';
import { Request, Response } from 'express';
import * as attendanceSummaryService from "../../../Service/StaffAttendenceService/AttendenceSummary/viewAttendenceSummary.js"
import { getPagination, getPaginationResponse } from "../../../utils/pagination.js"

export const viewAttendenceSummary = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const { page, size, name, status, from, to } = req.query;
        const { limit, offset } = getPagination(page, size);
        const companyId = parseInt(req.params.id);

        // Call service
        const result = await attendanceSummaryService.viewAttendenceSummary(limit, offset, hrModels, companyId, name, status, from, to);

        // Wrap result with totals
        const wrappedResult = {
            count: result.count,
            totalLateStaff: result.totalLateStaff,
            totalAbsentStaff: result.totalAbsentStaff,
            totalPresentStaff: result.totalPresentStaff,
            totalHalfDayStaff: result.totalHalfDayStaff,
            rows: result.rows
        };

        // Use getPaginationResponse (unchanged)
        const response = getPaginationResponse(wrappedResult, page, limit);

        // Merge totals back into response
        res.status(200).json({
            ...response,
            totalLateStaff: wrappedResult.totalLateStaff,
            totalAbsentStaff: wrappedResult.totalAbsentStaff,
            totalPresentStaff: wrappedResult.totalPresentStaff,
            totalHalfDayStaff: wrappedResult.totalHalfDayStaff
        });
    } catch (error) {
        console.error("Error fetching attendence summary:", error);
        res.status(500).json({ error: "Failed to fetch attendence summary" });
    }
};
