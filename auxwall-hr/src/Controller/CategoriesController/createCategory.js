import * as categoriesService from "../../Service/CategoriesService/createCategory.js";

export const createCategory = async (req, res) => {
    try {
        const category = await categoriesService.createCategory(req.body);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}