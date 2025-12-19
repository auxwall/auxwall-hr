import { Categories } from "../../models/index.js";

export async function deleteCategory(id) {
    const selectedCategory = await Categories.findByPk(id);
    if (!selectedCategory) {
        const error = new Error(`Category with ID ${id} not found.`);
        error.status = 404;
        throw error;
    }
    await Categories.destroy({ where: { id: id } });
    return await Categories.findAll();
}
