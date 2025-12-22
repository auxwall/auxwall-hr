import * as dashboardService from "../../Service/DashboardService/getHrDashboard.js";

export const getHrDashboard = async (req, res, hrModels) => {
    try {
        const document = await dashboardService.getHrDashboard(hrModels);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}