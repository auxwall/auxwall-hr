
import { Document } from "../models/index.js";

export async function getDocuments() {
    const documents = await Document.findAll();
    return documents;
}

export async function getDocument(id) {
    const document = await Document.findByPk(id);
    if (!document) {
        const error = new Error(`Document with ID ${id} not found.`);
        error.status = 404;
        throw error;
    }
    return document;
}

export async function createDocument(document) {
    const newDocument = await Document.create(document);
    return newDocument;
}

export async function updateDocument(id, document) {
    const selectedDocument = await Document.findByPk(id);
    if (!selectedDocument) {
        const error = new Error(`Document with ID ${id} not found.`);
        error.status = 404;
        throw error;
    }
    selectedDocument.set(document);
    await selectedDocument.save();
    return selectedDocument;
}

export async function deleteDocument(id) {
    const selectedDocument = await Document.findByPk(id);
    if (!selectedDocument) {
        const error = new Error(`Document with ID ${id} not found.`);
        error.status = 404;
        throw error;
    }
    await Document.destroy({ where: { id: id } });
    return await Document.findAll();
}