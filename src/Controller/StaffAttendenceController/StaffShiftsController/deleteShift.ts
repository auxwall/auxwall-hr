import { HRModels } from '../../../types.js';
import { Request, Response } from 'express';
import * as shiftService from "../../../Service/StaffAttendenceService/StaffShiftService/deleteShift.js";

export const deleteShift = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const id = parseInt(req.params.id);
        const shift = await shiftService.deleteShift(id, hrModels.StaffShift);
        res.status(200).json(shift);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
