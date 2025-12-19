import * as dashboardService from "../../Service/DashboardService/getRecentActivities.js";

export const getRecentActivities = async (req, res) => {
    try {
        const document = await dashboardService.getRecentActivities();
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}