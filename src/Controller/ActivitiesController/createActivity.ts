import { HRModels } from '../../types.js';
import { Request, Response } from 'express';
import * as activitiesService from "../../Service/ActivitiesService/createActivity.js";

export const createActivity = (req: Request, res: Response, hrModels: HRModels) => {
    activitiesService.createActivity(req.body, hrModels.Activity)
        .then((activity) => {
            res.status(201).json(activity);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};
