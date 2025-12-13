import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
const Categories = sequelize.define("categories", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        index: true,
        foreignKey: true,
        references: {
            model: "company",
            key: "id"
        },
        field: "companyId"
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "hr_category_name"
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "hr_category_parent_id",
        foreignKey: true,
        references: {
            model: "hr_categories",
            key: "id"
        }
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "staffs",
            key: "id"
        }
    }
},
    {
        tableName: "hr_categories",
        timestamps: true,
        allowNull: false,
        createdAt: "created_at",
        updatedAt: "updated_at"
    })

export default Categories
