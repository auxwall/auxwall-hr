import * as activitiesService from "../../Service/ActivitiesService/createActivity.js";

export const createActivity = (req, res, hrModels) => {
    activitiesService.createActivity(req.body, hrModels.Activity)
        .then((activity) => {
            res.status(201).json(activity);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};
