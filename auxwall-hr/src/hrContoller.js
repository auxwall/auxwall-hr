import * as hrService from "./hrService.js";

export const createCompany = async (req, res) => {
    try {
        const company = await hrService.createCompany(req.body);
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const getCompany = async (req, res) => {
    try {
        const company = await hrService.getCompany();
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const createStaff = async (req, res) => {
    try {
        const staff = await hrService.createStaff(req.body);
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const getStaff = async (req, res) => {
    try {
        const staff = await hrService.getStaff();
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getCategories = async (req, res) => {
    try {
        const categories = await hrService.getCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const createCategory = async (req, res) => {
    try {
        const category = await hrService.createCategory(req.body);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const updateCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const category = await hrService.updateCategory(id, req.body);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const deleteCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const category = await hrService.deleteCategory(id);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const getDocuments = async (req, res) => {
    try {
        const documents = await hrService.getDocuments();
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getDocument = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const document = await hrService.getDocument(id);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const createDocument = async (req, res) => {
    try {
        const document = await hrService.createDocument(req.body);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateDocument = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const document = await hrService.updateDocument(id, req.body);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteDocument = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const document = await hrService.deleteDocument(id);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getHrDashboard = async (req, res) => {
    try {
        const document = await hrService.getHrDashboard();
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getSummary = async (req, res) => {
    try {
        const document = await hrService.getSummary();
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getNearExpiryDocuments = async (req, res) => {
    try {
        const document = await hrService.getNearExpiryDocuments();
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getRecentActivities = async (req, res) => {
    try {
        const document = await hrService.getRecentActivities();
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
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}