export async function getActivities(limit, offset, ActivityModel, companyId) {
    try {
        const activities = await ActivityModel.findAndCountAll({
            where: {
                companyId
            },
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