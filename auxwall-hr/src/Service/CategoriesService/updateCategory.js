export async function updateCategory(id, category, CategoryModel) {
    const selectedCategory = await CategoryModel.findByPk(id);
    if (!selectedCategory) {
        const error = new Error(`Category with ID ${id} not found.`);
        error.status = 404;
        throw error;
    }
    selectedCategory.set(category);
    await selectedCategory.save();
    return selectedCategory;
}