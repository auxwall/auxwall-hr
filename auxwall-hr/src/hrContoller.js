import * as hrService from "./hrService.js";

export const getCategories = async (req, res) => {
    const categories = await hrService.getCategories();
    res.status(200).json(categories);
}
export const createCategory = async (req, res) => {
    const category = await hrService.createCategory(req.body);
    res.status(200).json(category);
}
export const updateCategory = async (req, res) => {
    const id = parseInt(req.params.id);
    const category = await hrService.updateCategory(id, req.body);
    res.status(200).json(category);
}
export const deleteCategory = async (req, res) => {
    const id = parseInt(req.params.id);
    const category = await hrService.deleteCategory(id);
    res.status(200).json(category);
}
export const getDocuments = async (req, res) => {
    const documents = await hrService.getDocuments();
    res.status(200).json(documents);
}

export const getDocument = async (req, res) => {
    const id = parseInt(req.params.id);
    const document = await hrService.getDocument(id);
    res.status(200).json(document);
}

export const createDocument = async (req, res) => {
    const document = await hrService.createDocument(req.body);
    res.status(200).json(document);
}

export const getHrDashboard = async (req, res) => {
    const document = await hrService.getHrDashboard();
    res.status(200).json(document);
}

export const getSummary = async (req, res) => {
    const document = await hrService.getSummary();
    res.status(200).json(document);
}

export const getNearExpiryDocuments = async (req, res) => {
    const document = await hrService.getNearExpiryDocuments();
    res.status(200).json(document);
}

export const getRecentActivities = async (req, res) => {
    const document = await hrService.getRecentActivities();
    res.status(200).json(document);
}

export async function getByCategory(req, res) {
    const {
        category,
        name,
        expiry_start,
        expiry_end
    } = req.query;

    const documents = await hrService.getByCategory(
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

}