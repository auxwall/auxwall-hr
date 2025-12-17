import * as Dashboard from "../Service/Dashboard.js";

export const getHrDashboard = async (req, res) => {
    try {
        const document = await Dashboard.getHrDashboard();
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getSummary = async (req, res) => {
    try {
        const document = await Dashboard.getSummary();
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getNearExpiryDocuments = async (req, res) => {
    try {
        const document = await Dashboard.getNearExpiryDocuments();
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getRecentActivities = async (req, res) => {
    try {
        const document = await Dashboard.getRecentActivities();
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getByCategory = async function (req, res) {
    try {
        const {
            category,
            name,
            expiry_start,
            expiry_end
        } = req.query;

        const documents = await Dashboard.getByCategory(
            category,
            name,
            expiry_start,
            expiry_end
        );

        res.status(200).json({
            message: "Documents filtered successfully",
            count: documents.length,
            data: documents
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}