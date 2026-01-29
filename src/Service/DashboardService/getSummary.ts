export async function getSummary(hrModels, companyId) {
    const sequelize = hrModels.Document.sequelize;
    const totalCategories = await hrModels.Category.count({
        where: {
            companyId
        }
    });

    const documentsPerCategory = await hrModels.Document.findAll({
        attributes: [
            [sequelize.literal('"hr_category_Id"'), 'categoryId'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'documentCount']
        ],
        group: [sequelize.literal('"hr_category_Id"')],
        where: {
            companyId
        }
    });

    return {
        totalCategories,
        documentsPerCategory
    }
}