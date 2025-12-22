export async function createCategory(category, CategoryModel) {
    const newCategory = await CategoryModel.create(category);
    return newCategory;
}