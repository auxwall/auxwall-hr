import { Op } from "sequelize";
import { sequelize } from "../config/database.js";
import { Activities, Categories, Document, Staff } from "../models/index.js";

export async function getHrDashboard() {
    const totalEmployees = await Staff.count();
    const totalCategories = await Categories.count();
    const totalDocuments = await Document.count();
    const expiredDocuments = await Document.count({ where: { hr_status: "Expired" } });
    const today = new Date();
    const fifteenDaysLater = new Date();
    fifteenDaysLater.setDate(today.getDate() + 15);

    const expiringSoon = await Document.count({
        where: {
            hr_status: "Active",
            hr_expiry_date: {
                [Op.gt]: today,
                [Op.lte]: fifteenDaysLater
            }
        }
    });
    const recentActivities = await Activities.findAll(
        {
            limit: 5,
            order: [['createdAt', 'DESC']],
            attributes: ["hr_action_type", "hr_description", "createdAt"]
        }
    )

    const alerts = {
        expiredDocuments,
        expiringSoon,
    };

    return {
        employees: {
            totalEmployees,
        },
        categories: {
            totalCategories,
        },
        documents: {
            totalDocuments,
            expiredDocuments,
            expiringSoon,
        },
        activities: recentActivities,
        alerts,
    };
};

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

export async function getNearExpiryDocuments() {
    const today = new Date();
    const sixtyDaysLater = new Date();
    sixtyDaysLater.setDate(today.getDate() + 60);
    const documents = await Document.findAll(
        {
            limit: 15,
            order: [['expiryDate', 'ASC']],
            where: {
                status: "Active",
                expiryDate: {
                    [Op.gt]: today,
                    [Op.lt]: sixtyDaysLater
                }
            }
        }
    );
    return documents;
}

export async function getRecentActivities() {
    const recentActivities = await Activities.findAll(
        {
            limit: 15,
            order: [['createdAt', 'DESC']],
        }

    );
    return recentActivities;
}

export async function getByCategory(categoryName, documentName, expiryStart, expiryEnd) {

    const documentWhere = {};
    const categoryWhere = {};

    if (documentName) {
        documentWhere.hr_document_name = {
            [Op.iLike]: `%${documentName}%`
        };
    }

    if (expiryStart || expiryEnd) {
        documentWhere.hr_expiry_date = {};

        if (expiryStart) {
            documentWhere.hr_expiry_date[Op.gte] = expiryStart;
        }
        if (expiryEnd) {
            documentWhere.hr_expiry_date[Op.lte] = expiryEnd;
        }
    }

    if (categoryName) {
        categoryWhere.hr_category_name = categoryName;
    }

    const documents = await Document.findAll({
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

    return documents.map(doc => ({
        documentName: doc.documentName,
        expiryDate: doc.expiryDate,
        categoryName: doc.category.name,
        staffName: doc.staff?.name || 'N/A',
        createdAt: doc.created_at
    }));
}