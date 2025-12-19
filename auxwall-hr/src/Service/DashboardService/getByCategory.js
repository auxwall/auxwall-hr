import { Op } from "sequelize";
import { Document, Categories, Staff } from "../../models/index.js";


export async function getByCategory(categoryName, documentName, expiryStart, expiryEnd, limit, offset) {

    const documentWhere = {};
    const categoryWhere = {};

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
            model: Categories,
            as: 'category',
            where: categoryWhere,
            required: Object.keys(categoryWhere).length > 0
        },
        {
            model: Staff,
            as: 'staff'
        }],
        order: [['created_at', 'DESC']]
    });

    const mappedRows = rows.map(doc => ({
        documentName: doc.documentName,
        expiryDate: doc.expiryDate,
        categoryName: doc.category.name,
        staffName: doc.staff?.name || 'N/A',
        createdAt: doc.created_at
    }));

    return { count, rows: mappedRows };
}