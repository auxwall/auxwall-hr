import * as documentService from "../../Service/DocumentsService/createDocument.js";

export const createDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "File is missing in request." });
        }

        const documentData = {
            ...req.body,
            originalName: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            mimeType: req.file.mimetype
        };

        const savedDoc = await documentService.createDocument(documentData);

        return res.status(201).json({
            success: true,
            data: savedDoc
        });

    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({
            error: "Internal Server Error",
            details: error.message
        });
    }
};
