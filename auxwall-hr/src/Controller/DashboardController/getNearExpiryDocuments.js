import * as dashboardService from "../../Service/DashboardService/getNearExpiryDocuments.js";

export const getNearExpiryDocuments = async (req, res, hrModels) => {
    try {
        const document = await dashboardService.getNearExpiryDocuments(hrModels.Document);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}