export async function getCategories(limit, offset, CategoryModel) {
    const categories = await CategoryModel.findAndCountAll({
        limit,
        offset,
        order: [
            ['id', 'DESC']
        ]
    });
    return categories;
}