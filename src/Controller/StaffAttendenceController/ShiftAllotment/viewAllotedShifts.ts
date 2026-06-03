import { HRModels } from '../../../types.js';
import { Request, Response } from 'express';
import * as shiftService from "../../../Service/StaffAttendenceService/ShiftAlloment/viewShift.js";
import { getPagination, getPaginationResponse } from "../../../utils/pagination.js"
export const viewAllotedShifts = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const { size, page, departmentId, name } = req.query;
        const { limit, offset } = getPagination(page, size);
        const companyId = parseInt(req.params.id);

        const viewShifts = await shiftService.viewShifts(limit, offset, hrModels.Schedule, hrModels.StaffShift, hrModels.Department, hrModels.Staff, hrModels.CompanyUserRelation, companyId, departmentId, name);
        const response = getPaginationResponse(viewShifts, page, limit);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}