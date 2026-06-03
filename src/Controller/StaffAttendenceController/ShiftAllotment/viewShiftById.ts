import { HRModels } from '../../../types.js';
import { Request, Response } from 'express';
import * as shiftService from "../../../Service/StaffAttendenceService/ShiftAlloment/viewShiftById.js";
export const viewShiftByIdController = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const id = parseInt(req.params.id);

        const viewShifts = await shiftService.viewShiftById(hrModels.Schedule, hrModels.StaffShift, hrModels.Department, hrModels.Staff, hrModels.CompanyUserRelation, id);
        res.status(200).json(viewShifts);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}