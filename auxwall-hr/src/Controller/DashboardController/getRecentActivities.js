import * as dashboardService from "../../Service/DashboardService/getRecentActivities.js";

export const getRecentActivities = async (req, res, hrModels) => {
    try {
        const document = await dashboardService.getRecentActivities(hrModels.Activity);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}