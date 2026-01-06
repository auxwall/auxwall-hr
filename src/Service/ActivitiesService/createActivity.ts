export async function createActivity(activity, ActivityModel) {
    try {
        const newActivity = await ActivityModel.create(activity);
        return newActivity;
    } catch (error) {
        return error;
    }
}