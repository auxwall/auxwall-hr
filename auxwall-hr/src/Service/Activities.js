import { Activities } from "../models/index.js";
export async function createActivity(activity) {
    try {
        const newActivity = await Activities.create(activity);
        return newActivity;
    } catch (error) {
        return error;
    }
}

export async function getActivities() {
    try {
        const activities = await Activities.findAll();
        return activities;
    } catch (error) {
        return error;
    }
}