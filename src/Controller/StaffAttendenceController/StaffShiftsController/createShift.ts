import { HRModels } from '../../../types.js';
import { Request, Response } from 'express';
import * as staffShiftService from "../../../Service/StaffAttendenceService/StaffShiftService/createShift.js";
export const createShift = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const shift = await staffShiftService.createShift(req.body, hrModels.StaffShift);
        res.status(200).json(shift);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}