export async function getRecentActivities(activityModels, companyId) {
    const recentActivities = await activityModels.findAll(
        {
            where: {
                companyId
            },
            limit: 15,
            order: [['createdAt', 'DESC']],
        }

    );
    return recentActivities;
}