import * as documentService from "../../Service/DocumentsService/updateDocument.js";

export const updateDocument = async (req, res, hrModels) => {
    try {
        const id = parseInt(req.params.id);
        const document = await documentService.updateDocument(id, req.body, req.file, hrModels.Document);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}