export async function getCategories(limit, offset, CategoryModel) {
    const categories = await CategoryModel.findAndCountAll({
        limit,
        offset,
        include: [{
            model: CategoryModel,
            as: 'parent',
            attributes: ['id', 'name']
        }],
        order: [
            ['id', 'DESC']
        ]
    });
    return categories;
}