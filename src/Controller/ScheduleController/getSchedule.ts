import * as scheduleService from "../../Service/ScheduleService/getSchedule.js";
import { HRModels } from "../../types.js";
import { getPagination, getPaginationResponse } from "../../utils/pagination.js";
export const getSchedule = async (req, res, hrModels: HRModels) => {
    try {
        const { page, size, departmentId, type } = req.query;
        const { limit, offset } = getPagination(page, size);
        const companyId = req.params.id;
        const data = await scheduleService.getSchedules(type, hrModels, companyId, departmentId, offset, limit);
        const response = getPaginationResponse(data, page, limit);
        return res.json(response);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to fetch schedule", error: err.message });
    }
};  