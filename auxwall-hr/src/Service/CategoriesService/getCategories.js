import { Categories } from "../../models/index.js";

export async function getCategories(limit, offset) {
    const categories = await Categories.findAndCountAll({
        limit,
        offset,
        order: [
            ['id', 'DESC']
        ]
    });
    return categories;
}