import * as scheduleService from "../../Service/ScheduleService/deleteSchedule.js";
import { HRModels } from "../../types.js";
export const deleteSchedule = async (req, res, hrModels: HRModels) => {
    try {
        const scheduleId = req.params.id;
        const data = await scheduleService.deleteSchedule(scheduleId, hrModels);

        return res.json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to delete schedule", error: err.message });
    }
};