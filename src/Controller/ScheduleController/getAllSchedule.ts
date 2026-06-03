import * as scheduleService from "../../Service/ScheduleService/getAllSchedule.js";
import { HRModels } from "../../types.js";
import { Request, Response } from 'express';
export const getAllSchedule = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const companyId = req.params.id;
        const { departmentId, type } = req.query;
        const data = await scheduleService.getAllSchedules(type, hrModels, companyId, departmentId);

        return res.json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to fetch schedule", error: err.message });
    }
};  