import * as activitiesService from "../Service/Activities.js";

export const createActivity = (req, res) => {
    activitiesService.createActivity(req.body)
        .then((activity) => {
            res.status(201).json(activity);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};

export const getActivities = (req, res) => {
    activitiesService.getActivities()
        .then((activities) => {
            res.status(200).json(activities);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};
