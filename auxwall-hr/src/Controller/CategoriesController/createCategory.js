import * as categoriesService from "../../Service/CategoriesService/createCategory.js";

export const createCategory = async (req, res, hrModels) => {
    try {
        const category = await categoriesService.createCategory(req.body, hrModels.Category);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}