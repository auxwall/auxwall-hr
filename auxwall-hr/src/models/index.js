import { defineDocument } from "./Documents.js";
import { defineCategory } from "./Categories.js";
import { defineActivity } from "./Activities.js";
import { defineStaffShift } from "./StaffShifts.js";
import { defineAttendenceSummary } from "./AttendenceSummary.js";

export const initModels = (sequelize, userModels) => {
    const { Staff, Company, Punching,Client } = userModels;

    // 1. Initialize Functional Models
    const Document = defineDocument(sequelize);
    const Category = defineCategory(sequelize);
    const Activity = defineActivity(sequelize);
    const StaffShift = defineStaffShift(sequelize);
    const AttendenceSummary = defineAttendenceSummary(sequelize);

    // 2. Setup Foreign Key Associations

    // --- Document Links ---
    Document.belongsTo(Company, { foreignKey: "companyId", as: "ownerCompany" });
    Document.belongsTo(Category, { foreignKey: "hr_category_Id", as: "category" });
    Document.belongsTo(Staff, { foreignKey: "hr_staff_id", as: "assignedStaff" });
    Document.belongsTo(Staff, { foreignKey: "hr_uploaded_by_id", as: "uploader" });
    Document.hasMany(Activity, { foreignKey: 'docId', onDelete: 'SET NULL' });

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

    // --- StaffShift Links ---
    StaffShift.belongsTo(Staff, { foreignKey: "staffId", as: "staff" });

    // --- AttendenceSummary Links ---
    AttendenceSummary.belongsTo(Staff, { foreignKey: "staffId", as: "staff" });
    AttendenceSummary.belongsTo(Client, { foreignKey: "clientId", as: "client" });

    return { Document, Category, Activity, Staff, Company, StaffShift, AttendenceSummary, Punching ,Client};
};