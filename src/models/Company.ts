import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
export const CompanyTable = sequelize.define("company", {
    companyName: { type: DataTypes.STRING, allowNull: false },
    branchName: { type: DataTypes.STRING },
    tradeLicense: { type: DataTypes.STRING },
    trn: { type: DataTypes.STRING },
    financialYear: { type: DataTypes.INTEGER, defaultValue: 6 },
    country: { type: DataTypes.INTEGER },
    emirate: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    poBox: { type: DataTypes.STRING },
    street: { type: DataTypes.STRING },
    telephone: { type: DataTypes.BIGINT },
    email: { type: DataTypes.STRING },
    website: { type: DataTypes.STRING },
    currency: { type: DataTypes.STRING, defaultValue: "AED" },
    defaultBank: { type: DataTypes.INTEGER },
    status: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdBy: { type: DataTypes.INTEGER },
    masterPc: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    pcId: { type: DataTypes.STRING },
    canScheduleEvents: { type: DataTypes.BOOLEAN, defaultValue: false }
},
    {
        tableName: "Company_Detials"
    });
export default CompanyTable;
