import { Activities } from "../../models/index.js";

export async function getRecentActivities() {
    const recentActivities = await Activities.findAll(
        {
            limit: 15,
            order: [['createdAt', 'DESC']],
        }

    );
    return recentActivities;
}