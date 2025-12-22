import * as documentService from "../../Service/DocumentsService/getDocument.js";

export const getDocument = async (req, res, hrModels) => {
    try {
        const id = parseInt(req.params.id);
        const document = await documentService.getDocument(id, hrModels.Document);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
