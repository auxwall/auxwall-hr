import * as categoriesService from "../../Service/CategoriesService/updateCategory.js";

export const updateCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const category = await categoriesService.updateCategory(id, req.body);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}