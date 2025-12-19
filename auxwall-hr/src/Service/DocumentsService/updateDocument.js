import { Document } from "../../models/index.js";
import fs from "fs";

export async function updateDocument(id, document, file) {
    const selectedDocument = await Document.findByPk(id);
    if (!selectedDocument) {
        const error = new Error(`Document with ID ${id} not found.`);
        error.status = 404;
        throw error;
    }
    if (file) {
        if (fs.existsSync(selectedDocument.filePath)) {
            fs.unlinkSync(selectedDocument.filePath);
        }
        document.documentName = file.originalname;
        document.filePath = file.path;
        document.fileSize = file.size;
        document.mimeType = file.mimetype;
    }
    // selectedDocument.set(document);
    // await selectedDocument.save();
    return await selectedDocument.update(document);
}