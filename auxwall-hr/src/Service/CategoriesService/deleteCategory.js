export async function deleteCategory(id, CategoryModel) {
    const selectedCategory = await CategoryModel.findByPk(id);
    if (!selectedCategory) {
        const error = new Error(`Category with ID ${id} not found.`);
        error.status = 404;
        throw error;
    }
    await CategoryModel.destroy({ where: { id: id } });
    return await CategoryModel.findAll();
}
