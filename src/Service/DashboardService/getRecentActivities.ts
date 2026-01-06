export async function getRecentActivities(activityModels) {
    const recentActivities = await activityModels.findAll(
        {
            limit: 15,
            order: [['createdAt', 'DESC']],
        }

    );
    return recentActivities;
}