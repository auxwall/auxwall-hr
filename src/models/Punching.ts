import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

export const attendanceTransactions = sequelize.define("attendanceTransactions", {
    device: { type: DataTypes.STRING },
    deviceId: { type: DataTypes.INTEGER },
    eventDate: { type: DataTypes.DATE },
    verify_mode_name: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    pin: { type: DataTypes.INTEGER },
    eventCode: { type: DataTypes.STRING },
    staffId: { type: DataTypes.INTEGER },
    companyId: { type: DataTypes.INTEGER },
    courseId: { type: DataTypes.INTEGER, allowNull: true },
},
    {
        tableName: "attendance_transactions"
    });
export default attendanceTransactions;