import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import { getPagination, getPaginationResponse } from "../../utils/pagination.js";
import * as activitiesService from "../../Service/ActivitiesService/getActivities.js";

export const getActivities = async (req: Request, res: Response, hrModels: HRModels) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    try {
        const activities = await activitiesService.getActivities(limit, offset, hrModels.Activity)
        const response = getPaginationResponse(activities, page, limit);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
