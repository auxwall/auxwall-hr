import * as dashboardService from "../../Service/DashboardService/getSummary.js";

export const getSummary = async (req, res) => {
    try {
        const document = await dashboardService.getSummary();
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}