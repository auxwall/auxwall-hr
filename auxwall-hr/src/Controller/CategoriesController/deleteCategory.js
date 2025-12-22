import * as categoriesService from "../../Service/CategoriesService/deleteCategory.js";

export const deleteCategory = async (req, res, hrModels) => {
    try {
        const id = parseInt(req.params.id);
        const category = await categoriesService.deleteCategory(id, hrModels.Category);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}