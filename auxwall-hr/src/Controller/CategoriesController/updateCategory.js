import * as categoriesService from "../../Service/CategoriesService/updateCategory.js";

export const updateCategory = async (req, res, hrModels) => {
    try {
        const id = parseInt(req.params.id);
        const category = await categoriesService.updateCategory(id, req.body, hrModels.Category);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}