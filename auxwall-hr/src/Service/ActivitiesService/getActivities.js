export async function getActivities(limit, offset, ActivityModel) {
    try {
        const activities = await ActivityModel.findAndCountAll({
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