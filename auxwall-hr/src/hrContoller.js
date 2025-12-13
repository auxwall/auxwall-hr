import * as hrService from "./hrService.js";

export const getCategories = async (req, res) => {
    const categories = await hrService.getCategories();
    res.status(200).json(categories);
}
export const createCategory = async (req, res) => {
    const category = await hrService.createCategory(req.body);
    res.status(200).json(category);
}
// export const updateCategory = (req, res) => {

// }
// export const deleteCategory = (req, res) => {

// }
export const getDocuments = async (req, res) => {
    const documents = await hrService.getDocuments();
    res.status(200).json(documents);
}

export const getDocument = async (req, res) => {
    const id = parseInt(req.params.id);
    const document = await hrService.getDocument(id);
    res.status(200).json(document);
}

export const createDocument = async (req, res) => {
    const document = await hrService.createDocument(req.body);
    res.status(200).json(document);
}
// export const updateDocument = (req, res) => {

// }
// export const deleteDocument = (req, res) => {

// }