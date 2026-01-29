// import { HRModels } from '../../types.js';
// import { Op } from "sequelize";

// export async function getByCategory(categoryId: any, categoryName: any, documentName: any, expiryStart: any, expiryEnd: any, limit: any, offset: any, hrModels: HRModels, companyId: any) {

//     const { Document, Category, Staff } = hrModels;

//     const documentWhere: any = {};
//     const categoryWhere: any = {};

//     if (documentName) {
//         documentWhere.documentName = {
//             [Op.iLike]: `%${documentName}%`
//         };
//     }

//     if (companyId) {
//         documentWhere.companyId = companyId;
//     }

//     if (expiryStart || expiryEnd) {
//         documentWhere.expiryDate = {};

//         if (expiryStart) {
//             documentWhere.expiryDate[Op.gte] = expiryStart;
//         }
//         if (expiryEnd) {
//             documentWhere.expiryDate[Op.lte] = expiryEnd;
//         }
//     }

//     if (categoryId) {
//         categoryWhere.id = categoryId;
//     }

//     if (categoryName) {
//         categoryWhere.name = {
//             [Op.iLike]: `%${categoryName}%`
//         };
//     }

//     if (companyId) {
//         categoryWhere.companyId = companyId;
//     }

//     const { count, rows } = await Document.findAndCountAll({
//         limit,
//         offset,
//         where: documentWhere,
//         include: [{
//             model: Category,
//             as: 'category',
//             where: categoryWhere,
//             required: Object.keys(categoryWhere).length > 0
//         },
//         {
//             model: Staff,
//             as: 'assignedStaff'
//         }],
//         order: [['created_at', 'DESC']]
//     });

//     const mappedRows = rows.map((doc: any) => ({
//         documentName: doc.documentName,
//         expiryDate: doc.expiryDate,
//         categoryName: doc.category.name,
//         staffName: doc.assignedStaff?.name || 'N/A',
//         createdAt: doc.created_at
//     }));

//     return { count, rows: mappedRows };
// }

import { HRModels } from '../../types.js';
import { Op } from 'sequelize';

export async function getByCategory(
    categoryId: any,
    categoryName: any,
    documentName: any,
    expiryStart: any,
    expiryEnd: any,
    type: any,
    status: any,
    limit: any,
    offset: any,
    hrModels: HRModels,
    companyId: any
) {
    const { Document, Category, Staff } = hrModels;

    const documentWhere: any = {};
    const categoryWhere: any = {};

    if (documentName) {
        documentWhere.documentName = { [Op.iLike]: `%${documentName}%` };
    }

    if (companyId) {
        documentWhere.companyId = companyId;
        categoryWhere.companyId = companyId;
    }

    if (expiryStart || expiryEnd) {
        documentWhere.expiryDate = {};

        if (expiryStart) {
            const startDate = new Date(expiryStart);
            startDate.setHours(0, 0, 0, 0);
            documentWhere.expiryDate[Op.gte] = startDate;
        }
        if (expiryEnd) {
            const endDate = new Date(expiryEnd);
            endDate.setHours(23, 59, 59, 999);
            documentWhere.expiryDate[Op.lte] = endDate;
        }
    }

    if (type) {
        documentWhere.mimeType = type;
    }
    if (status) {
        documentWhere.status = status;
    }
    if (categoryId) {
        categoryWhere.id = parseInt(categoryId as string);
    }

    if (categoryName) {
        categoryWhere.name = { [Op.iLike]: `%${categoryName}%` };
    }

    const { count, rows } = await Document.findAndCountAll({
        limit,
        offset,
        where: documentWhere,
        include: [
            {
                model: Category,
                as: 'category',
                where: Object.keys(categoryWhere).length > 0 ? categoryWhere : undefined,
                required: Object.keys(categoryWhere).length > 0
            },
            {
                model: Staff,
                as: 'assignedStaff'
            }
        ],
        order: [['created_at', 'DESC']]
    });

    const mappedRows = rows.map((doc: any) => ({
        documentName: doc.documentName,
        expiryDate: doc.expiryDate,
        status: doc.status,
        type: doc.mimeType,
        categoryName: doc.category?.name || 'N/A',
        staffName: doc.assignedStaff?.name || 'N/A',
        createdAt: doc.created_at
    }));

    return { count, rows: mappedRows };
}
