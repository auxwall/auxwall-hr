// controllers/scheduleController.js
import { HRModels } from "../../types.js";
import * as scheduleService from "../../Service/ScheduleService/createSchedule.js";

export const createOrUpdateSchedule = async (req, res, hrModels: HRModels) => {
    try {
        const { type, data, companyId, departmentId, name } = req.body;

        if (!type || !data) return res.status(400).json({ message: "Type and schedule required" });

        await scheduleService.saveSchedule(type, data, hrModels.Schedule, companyId, departmentId, name);

        return res.json({ message: `${type} schedule saved successfully!` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to save schedule", error: err.message });
    }
};



