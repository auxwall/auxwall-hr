export async function getCategories(limit, offset, CategoryModel, companyId) {
    const categories = await CategoryModel.findAndCountAll({
        where: {
            companyId
        },
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