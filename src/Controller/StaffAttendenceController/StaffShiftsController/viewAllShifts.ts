import { HRModels } from '../../../types.js';
import { Request, Response } from 'express';
import * as shiftServie from "../../../Service/StaffAttendenceService/StaffShiftService/viewAllShifts.js";
export const viewAllShifts = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const { departmentId, name } = req.query;
        const companyId = parseInt(req.params.id);

        const viewShifts = await shiftServie.viewAllShifts(hrModels.StaffShift, hrModels.Department, companyId, departmentId, name);
        res.status(200).json(viewShifts);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}