import { HRModels } from '../../../types.js';
import { Request, Response } from 'express';
import * as attendenceService from "../../../Service/StaffAttendenceService/AttendenceSummary/attendenceById.js";
export const attendenceById = async (req: Request, res: Response, hrModels: HRModels) => {
    try {

        const id = parseInt(req.params.id);

        const attendence = await attendenceService.attendenceById(id, hrModels.AttendenceSummary);
        res.status(200).json(attendence);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}