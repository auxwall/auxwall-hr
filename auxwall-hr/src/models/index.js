import { defineDocument } from "./Documents.js";
import { defineCategory } from "./Categories.js";
import { defineActivity } from "./Activities.js";

export const initModels = (sequelize, userModels) => {
    const { Staff, Company } = userModels;

    // 1. Initialize Functional Models
    const Document = defineDocument(sequelize);
    const Category = defineCategory(sequelize);
    const Activity = defineActivity(sequelize);

    // 2. Setup Foreign Key Associations

    // --- Document Links ---
    Document.belongsTo(Company, { foreignKey: "companyId", as: "ownerCompany" });
    Document.belongsTo(Category, { foreignKey: "hr_category_Id", as: "category" });
    Document.belongsTo(Staff, { foreignKey: "hr_staff_id", as: "assignedStaff" });
    Document.belongsTo(Staff, { foreignKey: "hr_uploaded_by_id", as: "uploader" });

    //Staff
    Staff.hasMany(Document, { foreignKey: "hr_staff_id", as: "staffDocuments" });
    Staff.hasMany(Document, { foreignKey: "hr_uploaded_by_id", as: "uploadedDocuments" });

    // --- Category Links ---
    Category.belongsTo(Company, { foreignKey: "companyId" },);
    Category.belongsTo(Category, { foreignKey: "parentId", as: "parent" }); // Self-reference
    Category.belongsTo(Staff, { foreignKey: "createdBy", as: "creator" });

    // --- Activity Links ---
    Activity.belongsTo(Company, { foreignKey: "companyId" });
    Activity.belongsTo(Document, { foreignKey: "docId", as: "relatedDoc" });
    Activity.belongsTo(Staff, { foreignKey: "userId", as: "actor" });

    return { Document, Category, Activity, Staff, Company };
};