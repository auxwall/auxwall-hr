import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Document = sequelize.define("document", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        index: true,
        references: {
            model: "company",
            key: "id"
        },
        field: "companyId"
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "hr_categories",
            key: "id"
        },
        field: "hr_category_Id"
    },
    documentName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "hr_document_name"
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "hr_file_path"
    },
    fileSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "hr_file_size_bytes"
    },
    mimeType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "hr_mime_type"
    },
    staffId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "staffs",
            key: "id"
        },
        field: "hr_staff_id"
    },
    expiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "hr_expiry_date"
    },
    reminderDays: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "hr_reminder_days"
    },
    status: {
        type: DataTypes.ENUM("Active", "Expired", "Archived"),
        defaultValue: "Active",
        allowNull: false,
        field: "hr_status"
    },
    uploadedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "staffs",
            key: "id"
        },
        field: "hr_uploaded_by_id"
    }
},
    {
        tableName: "hr_documents",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    })

export default Document