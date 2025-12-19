import { Document } from "../../models/index.js";

export async function getDocument(id) {
    const document = await Document.findByPk(id);
    if (!document) {
        const error = new Error(`Document with ID ${id} not found.`);
        error.status = 404;
        throw error;
    }
    return document;
}