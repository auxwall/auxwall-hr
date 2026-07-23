import { defineDocument } from "./Documents.js";
import { defineCategory } from "./Categories.js";
import { defineActivity } from "./Activities.js";
import { defineStaffShift } from "./StaffShifts.js";
import { defineAttendenceSummary } from "./AttendenceSummary.js";
import { defineDepartment } from "./Department.js";
import { Sequelize } from "sequelize";
import { UserModels, HRModels } from "../types.js";
import defineCronLog from "./cronLog.model.js";
import { defineSchedule } from "./Schedule.js";
import { defineDevice } from "./Devices.js";
import { defineZKDeviceTable } from "./ZKDevice.js";
import { defineZKCommandTable } from "./ZKCommand.js";
import { defineZKBiometricTable } from "./ZKBiometric.js";

export const initModels = (sequelize: Sequelize, userModels: UserModels): HRModels => {
    const { Staff, Company, Punching, CompanyUserRelation } = userModels;

    // 1. Initialize Functional Models
    const Document = defineDocument(sequelize);
    const Category = defineCategory(sequelize);
    const Activity = defineActivity(sequelize);
    const StaffShift = defineStaffShift(sequelize);
    const AttendenceSummary = defineAttendenceSummary(sequelize);
    const Department = defineDepartment(sequelize);
    const CronLog = defineCronLog(sequelize);
    const Schedule = defineSchedule(sequelize);
    const Device = defineDevice(sequelize);
    const ZKDevice = defineZKDeviceTable(sequelize);
    const ZKCommand = defineZKCommandTable(sequelize);
    const ZKBiometric = defineZKBiometricTable(sequelize);

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
    Staff.belongsTo(Department, { foreignKey: "departmentId", as: "department" });
    // Staff.belongsToMany(Company, { through: CompanyUserRelation, foreignKey: "userId" })
    // Staff.belongsTo(Staff, { foreignKey: 'createdBy', as: 'creator' })
    // Staff -> Shift
    Staff.belongsTo(StaffShift, { foreignKey: "shiftId", as: "shift" });

    // Staff -> Schedule
    Staff.belongsTo(Schedule, { foreignKey: "scheduleId", as: "schedule" });
    Staff.hasMany(Device, { foreignKey: "createdBy", as: "devices" });


    Company.belongsToMany(Staff, { through: CompanyUserRelation, foreignKey: "companyId" })
    // --- Category Links ---
    Category.belongsTo(Company, { foreignKey: "companyId" });
    Category.belongsTo(Category, { foreignKey: "parentId", as: "parent" }); // Self-reference
    Category.belongsTo(Staff, { foreignKey: "createdBy", as: "creator" });

    // --- Activity Links ---
    Activity.belongsTo(Company, { foreignKey: "companyId" });
    Activity.belongsTo(Document, { foreignKey: "docId", as: "relatedDoc" });
    Activity.belongsTo(Staff, { foreignKey: "userId", as: "actor" });

    // --- StaffShift Links ---
    StaffShift.belongsTo(Staff, { foreignKey: "uploadedBy", as: "uploader" });
    StaffShift.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
    StaffShift.hasMany(Schedule, {
        foreignKey: "shiftId",
        as: "schedules"
    });

    Schedule.belongsTo(StaffShift, {
        foreignKey: "shiftId",
        as: "shift"
    });
    // Shift -> Department

    // --- AttendenceSummary Links ---
    AttendenceSummary.belongsTo(Staff, { foreignKey: "staffId", as: "staff" });

    // --- Schedule Links ---
    Schedule.belongsTo(Company, { foreignKey: "companyId" });
    Schedule.belongsTo(Department, { foreignKey: "departmentId", as: "department" });

    // --- Department Links ---
    Department.belongsTo(Company, { foreignKey: "companyId" });
    Department.belongsTo(Staff, { foreignKey: "createdBy", as: "creator" });
    Department.hasMany(Staff, { foreignKey: "departmentId", as: "staffs" });

    Device.belongsTo(Staff, { foreignKey: "createdBy", as: "creator" });
    Device.belongsTo(Company, { foreignKey: "companyId" });

    // --- Company Links ---
    Company.hasMany(Department, { foreignKey: "companyId" });
    // Company.belongsToMany(Staff, { through: CompanyUserRelation, foreignKey: "companyId" })

    return { Document, Category, Activity, Staff, CompanyUserRelation, Company, StaffShift, AttendenceSummary, Punching, Department, CronLog, Schedule, Device, ZKDevice, ZKCommand, ZKBiometric };
};