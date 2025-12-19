import * as categoriesService from "../../Service/CategoriesService/deleteCategory.js";

export const deleteCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const category = await categoriesService.deleteCategory(id);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}