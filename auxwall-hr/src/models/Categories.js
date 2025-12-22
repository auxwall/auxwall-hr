import { DataTypes } from "sequelize";

export const defineCategory = (sequelize) => {
    const Category = sequelize.define("categories", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        companyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "companyId"
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "hr_category_name"
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "hr_category_parent_id"
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    },
        {
            tableName: "hr_categories",
            timestamps: true,
            allowNull: false,
            createdAt: "created_at",
            updatedAt: "updated_at"
        })

    return Category;
};
