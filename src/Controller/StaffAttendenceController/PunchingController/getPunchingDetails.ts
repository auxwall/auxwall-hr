import { HRModels } from '../../../types.js';
import { Request, Response } from 'express';
import * as punchingService from "../../../Service/StaffAttendenceService/PunchingService/getPunchingDetails.js";
import { getPaginationResponse, getPagination } from "../../../utils/pagination.js";
export const getPunchingDetails = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const { page, size } = req.query;
        const { limit, offset } = getPagination(page, size);
        const punching = await punchingService.getPunchingDetails(limit, offset, hrModels.Punching);
        const response = getPaginationResponse(punching, page, limit);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}