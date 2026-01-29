export async function getCategoryTree(CategoryModel, companyId, limit, offset) {
    const categories = await CategoryModel.findAll({
        where: {
            companyId
        },
        attributes: ['id', 'name', 'parentId'],
        raw: true,
        order: [['id', 'ASC']],
        limit,
        offset
    });
    const tree: any = [];
    const map: any = {};
    categories.forEach(category => {
        map[category.id] = {
            value: category.id,
            label: category.name,
            children: []
        };
    });
    categories.forEach(category => {
        if (category.parentId && map[category.parentId]) {
            map[category.parentId].children.push(map[category.id]);
        } else {
            tree.push(map[category.id]);
        }
    });
    return { count: categories.length, rows: tree };
}