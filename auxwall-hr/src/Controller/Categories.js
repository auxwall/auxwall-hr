import * as Categories from "../Service/Categories.js";
export const getCategories = async (req, res) => {
    try {
        const categories = await Categories.getCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const createCategory = async (req, res) => {
    try {
        const category = await Categories.createCategory(req.body);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const updateCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const category = await Categories.updateCategory(id, req.body);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const deleteCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const category = await Categories.deleteCategory(id);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}