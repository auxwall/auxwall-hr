import { Activities } from "../../models/index.js";

export async function createActivity(activity) {
    try {
        const newActivity = await Activities.create(activity);
        return newActivity;
    } catch (error) {
        return error;
    }
}