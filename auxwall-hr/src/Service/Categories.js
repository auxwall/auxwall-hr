import { Categories } from "../models/index.js";

export async function getCategories() {
    const categories = await Categories.findAll();
    return categories;
}

export async function createCategory(category) {
    const newCategory = await Categories.create(category);
    return newCategory;
}

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
