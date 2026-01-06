import { HRModels } from '../../types.js';
import { Op } from "sequelize";

export async function getByCategory(categoryId: any, categoryName: any, documentName: any, expiryStart: any, expiryEnd: any, limit: any, offset: any, hrModels: HRModels) {

    const { Document, Category, Staff } = hrModels;

    const documentWhere: any = {};
    const categoryWhere: any = {};

    if (documentName) {
        documentWhere.documentName = {
            [Op.iLike]: `%${documentName}%`
        };
    }

    if (expiryStart || expiryEnd) {
        documentWhere.expiryDate = {};

        if (expiryStart) {
            documentWhere.expiryDate[Op.gte] = expiryStart;
        }
        if (expiryEnd) {
            documentWhere.expiryDate[Op.lte] = expiryEnd;
        }
    }

    if (categoryId) {
        categoryWhere.id = categoryId;
    }

    if (categoryName) {
        categoryWhere.name = {
            [Op.iLike]: `%${categoryName}%`
        };
    }

    const { count, rows } = await Document.findAndCountAll({
        limit,
        offset,
        where: documentWhere,
        include: [{
            model: Category,
            as: 'category',
            where: categoryWhere,
            required: Object.keys(categoryWhere).length > 0
        },
        {
            model: Staff,
            as: 'assignedStaff'
        }],
        order: [['created_at', 'DESC']]
    });

    const mappedRows = rows.map((doc: any) => ({
        documentName: doc.documentName,
        expiryDate: doc.expiryDate,
        categoryName: doc.category.name,
        staffName: doc.assignedStaff?.name || 'N/A',
        createdAt: doc.created_at
    }));

    return { count, rows: mappedRows };
}