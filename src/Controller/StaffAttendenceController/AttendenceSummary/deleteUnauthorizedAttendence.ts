import { HRModels } from '../../../types.js';
import { Request, Response } from 'express';
import * as attendenceService from "../../../Service/StaffAttendenceService/AttendenceSummary/deleteUnauthorizedAttendence.js";

export const deleteUnauthorizedAttendence = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const id = parseInt(req.params.id);
        const attendence = await attendenceService.deleteUnauthorizedAttendence(id, hrModels.AttendenceSummary, hrModels.Punching, hrModels.Staff);
        res.status(200).json(attendence);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}