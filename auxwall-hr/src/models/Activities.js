import { DataTypes } from "sequelize";

export const defineActivity = (sequelize) => {
    const Activity = sequelize.define("activities", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        companyId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        docId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "hr_user_id"
        },
        actionType: {
            type: DataTypes.ENUM("Upload", "Update", "Delete", "Download", "View"),
            field: "hr_action_type"
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

    return Activity;
};
