import { Categories, Document } from "./models/index.js";

export async function getCategories() {
    const categories = await Categories.findAll();
    return categories;
}

export async function createCategory(category) {
    const newCategory = await Categories.create(category);
    return newCategory;
}

export async function getDocuments() {
    const documents = await Document.findAll();
    return documents;
}

export async function getDocument(id) {
    const document = await Document.findByPk(id);
    return document;
}

export async function createDocument(document) {
    const newDocument = await Document.create(document);
    return newDocument;
}
