import { HRModels } from '../../../types.js';
import { Request, Response } from 'express';
import * as getAttendenceStatusService from "../../../Service/StaffAttendenceService/AttendenceSummary/getAttendenceStatus.js";
export const getAttendenceStatus = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const result = await getAttendenceStatusService.getAttendenceStatus(hrModels.AttendenceSummary);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}
