import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

export const userCompanyRelationTable = sequelize.define("companyUserRelation", {
    createdBy: { type: DataTypes.INTEGER },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    role: { type: DataTypes.INTEGER, defaultValue: 0 },
    companyId: { type: DataTypes.INTEGER, allowNull: false },
},
    {
        tableName: "user_Company_Relations",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    });
export default userCompanyRelationTable;