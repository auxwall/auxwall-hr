import { Activities, Categories, Document, Staff, Company } from "./models/index.js";
import { Op, where } from "sequelize";
import { sequelize } from "./config/database.js";

export async function createCompany(company) {
    const newCompany = await Company.create(company);
    return newCompany;
}
export async function getCompany() {
    const company = await Company.findAll();
    return company;
}
export async function createStaff(staff) {
    const newStaff = await Staff.create(staff);
    return newStaff;
}
export async function getStaff() {
    const staff = await Staff.findAll();
    return staff;
}
export async function getCategories() {
    const categories = await Categories.findAll();
    return categories;
}

export async function createCategory(category) {
    const newCategory = await Categories.create(category);
    return newCategory;
}

export async function updateCategory(id, category) {
    const selectedCategory = await Categories.findByPk(id);
    if (!selectedCategory) {
        const error = new Error(`Category with ID ${id} not found.`);
        error.status = 404;
        throw error;
    }
    selectedCategory.set(category);
    await selectedCategory.save();
    return selectedCategory;
}

export async function deleteCategory(id) {
    const selectedCategory = await Categories.findByPk(id);
    if (!selectedCategory) {
        const error = new Error(`Category with ID ${id} not found.`);
        error.status = 404;
        throw error;
    }
    await Categories.destroy({ where: { id: id } });
    return await Categories.findAll();
}

export async function getDocuments() {
    const documents = await Document.findAll();
    return documents;
}

export async function getDocument(id) {
    const document = await Document.findByPk(id);
    if (!document) {
        const error = new Error(`Document with ID ${id} not found.`);
        error.status = 404;
        throw error;
    }
    return document;
}

export async function createDocument(document) {
    const newDocument = await Document.create(document);
    return newDocument;
}

export async function updateDocument(id, document) {
    const selectedDocument = await Document.findByPk(id);
    if (!selectedDocument) {
        const error = new Error(`Document with ID ${id} not found.`);
        error.status = 404;
        throw error;
    }
    selectedDocument.set(document);
    await selectedDocument.save();
    return selectedDocument;
}

export async function deleteDocument(id) {
    const selectedDocument = await Document.findByPk(id);
    if (!selectedDocument) {
        const error = new Error(`Document with ID ${id} not found.`);
        error.status = 404;
        throw error;
    }
    await Document.destroy({ where: { id: id } });
    return await Document.findAll();
}

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
        staffName: doc.staff.name,
        createdAt: doc.created_at
    }));
}