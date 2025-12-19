import { Categories } from "../../models/index.js";

export async function updateCategory(id, category) {
    const selectedCategory = await Categories.findByPk(id);
    if (!selectedCategory) {
        const error = new Error(`Category with ID ${id} not found.`);
        error.status = 404;
        throw error;
    }
    selectedCategory.set(category);
    await selectedCategory.save();
    return selectedCategory;
}