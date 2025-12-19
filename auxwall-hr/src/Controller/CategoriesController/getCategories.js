import { getPagination, getPaginationResponse } from "../../utils/pagination.js";
import * as categoriesService from "../../Service/CategoriesService/getCategories.js";

export const getCategories = async (req, res) => {
    try {
        const { page, size } = req.query;
        const { limit, offset } = getPagination(page, size);
        const categories = await categoriesService.getCategories(limit, offset);
        const response = getPaginationResponse(categories, page, limit);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}