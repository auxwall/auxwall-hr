// models/Schedule.js
import { DataTypes } from "sequelize";

export const defineSchedule = (sequelize) => {
    const Schedule = sequelize.define("schedule", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM("week", "month"),
            allowNull: false
        },
        data: {
            type: DataTypes.JSON, // store the full week/month schedule as JSON
            allowNull: false
        },
        companyId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "companyId"
        },
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "departmentId"
        }
    },
        {
            tableName: "schedule",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at"
        });

    return Schedule;
}
