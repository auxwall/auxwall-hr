import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Activities = sequelize.define("activities", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "company",
            key: "id"
        }
    },
    docId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "hr_documents",
            key: "id"
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "staffs",
            key: "id"
        },
        field: "hr_user_id"
    },
    actionType: {
        type: DataTypes.ENUM("Upload", "Update", "Delete", "Download", "View")
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "hr_description"
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
},
    { tableName: "hr_activities" })

export default Activities
