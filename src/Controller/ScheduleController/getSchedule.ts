import * as scheduleService from "../../Service/ScheduleService/getSchedule.js";
import { HRModels } from "../../types.js";
export const getSchedule = async (req, res, hrModels: HRModels) => {
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