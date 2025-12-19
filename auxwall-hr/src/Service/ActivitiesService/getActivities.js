import { Activities } from "../../models/index.js";

export async function getActivities(limit, offset) {
    try {
        const activities = await Activities.findAndCountAll({
            limit,
            offset,
            order: [
                ['id', 'DESC']
            ]
        });
        return activities;
    } catch (error) {
        return error;
    }
}