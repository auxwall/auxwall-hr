import { HRModels } from '../../../types.js';
import { Request, Response } from 'express';
import * as shiftService from "../../../Service/StaffAttendenceService/ShiftAlloment/allotShift.js";
export const allotShift = async (req: Request, res: Response, hrModels: HRModels) => {
    try {

        const { scheduleId, staffId, shiftId } = req.body;

        const companyId = Number(req.params.id);

        const result = await shiftService.updateStaffShiftAllotment(
            staffId,
            companyId,
            shiftId,
            scheduleId,
            hrModels.Staff,
            hrModels.CompanyUserRelation
        );

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};