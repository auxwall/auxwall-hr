import * as documentService from "../../Service/DocumentsService/deleteDocument.js";

export const deleteDocument = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const document = await documentService.deleteDocument(id);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
