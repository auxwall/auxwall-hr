import { sequelize } from "../../config/database.js";
import { Categories, Document } from "../../models/index.js";

export async function getSummary() {
    const totalCategories = await Categories.count();

    const documentsPerCategory = await Document.findAll({
        attributes: [
            [sequelize.literal('"hr_category_Id"'), 'categoryId'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'documentCount']
        ],
        group: [sequelize.literal('"hr_category_Id"')],
        raw: true
    });

    return {
        totalCategories,
        documentsPerCategory
    }
}