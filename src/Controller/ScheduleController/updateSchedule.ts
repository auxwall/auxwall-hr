import * as scheduleService from "../../Service/ScheduleService/updateSchedule.js";
import { HRModels } from "../../types.js";
import { Request, Response } from "express";

export const updateScheduleController = async (req: Request, res: Response, hrModels: HRModels) => {
    try {
        const { id } = req.params;
        const { data } = req.body;

        const result = await scheduleService.updateSchedule(
            Number(id),
            data,
            hrModels.Schedule
        );

        return res.json(result);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: err.message || "Failed to update schedule"
        });
    }
};