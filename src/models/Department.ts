import { DataTypes } from "sequelize";

export const defineDepartment = (sequelize) => {
    const Department = sequelize.define(
        "hr_departments",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "department_name"
            },
            companyId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: "company_id"
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },
            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "created_by"
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: DataTypes.NOW
            }
        },
        {
            tableName: "hr_departments"
        }
    );

    return Department;
};
