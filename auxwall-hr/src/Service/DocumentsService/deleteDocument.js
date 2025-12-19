import { Document } from "../../models/index.js";
import fs from "fs";

export async function deleteDocument(id) {
    const selectedDocument = await Document.findByPk(id);
    if (!selectedDocument) {
        const error = new Error(`Document with ID ${id} not found.`);
        error.status = 404;
        throw error;
    }
    if (fs.existsSync(selectedDocument.filePath)) {
        fs.unlinkSync(selectedDocument.filePath);
        console.log("File deleted successfully");
    }
    else {
        console.log("File not found");
    }
    await Document.destroy({ where: { id: id } });
    return await Document.findAll();
}