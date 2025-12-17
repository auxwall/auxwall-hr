import * as Documents from "../Service/Documents.js";

export const getDocuments = async (req, res) => {
    try {
        const documents = await Documents.getDocuments();
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getDocument = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const document = await Documents.getDocument(id);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const createDocument = async (req, res) => {
    try {
        const document = await Documents.createDocument(req.body);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateDocument = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const document = await Documents.updateDocument(id, req.body);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteDocument = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const document = await Documents.deleteDocument(id);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
