import * as scheduleService from "../../Service/ScheduleService/getScheduleById.js";
import { HRModels } from "../../types.js";
export const getScheduleById = async (req, res, hrModels: HRModels) => {
    try {
        const scheduleId = req.params.id;
        const data = await scheduleService.getScheduleById(scheduleId, hrModels);

        return res.json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to fetch schedule", error: err.message });
    }
};