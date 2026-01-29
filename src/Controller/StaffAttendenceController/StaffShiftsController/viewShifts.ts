import { HRModels } from '../../../types.js';
import { Request, Response } from 'express';
import * as shiftServie from "../../../Service/StaffAttendenceService/StaffShiftService/viewShifts.js";
import { getPagination, getPaginationResponse } from "../../../utils/pagination.js"
export const viewShifts = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const { size, page, departmentId, name } = req.query;
        const { limit, offset } = getPagination(page, size);
        const companyId = parseInt(req.params.id);

        const viewShifts = await shiftServie.viewShifts(limit, offset, hrModels.StaffShift, hrModels.Department, companyId, departmentId, name);
        const response = getPaginationResponse(viewShifts, page, limit);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}