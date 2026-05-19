import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"
export const usersTable = sequelize.define("users", {
    // id: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true,autoIncrement: true, defaultValue: Sequelize.INTEGERV4,},
    fullName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING },
    joinDate: { type: DataTypes.DATEONLY },
    designation: { type: DataTypes.STRING },
    isMale: { type: DataTypes.BOOLEAN, defaultValue: true },
    dateOfBirth: { type: DataTypes.DATEONLY },
    emiratesId: { type: DataTypes.STRING },
    visaExpiry: { type: DataTypes.DATEONLY },
    address: { type: DataTypes.STRING },
    homePhone: { type: DataTypes.INTEGER },
    mobile: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, unique: true },
    userName: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    resetPasswordToken: { type: DataTypes.STRING },
    salary: { type: DataTypes.INTEGER },
    nationality: { type: DataTypes.INTEGER },
    isTrainer: { type: DataTypes.BOOLEAN, defaultValue: false },
    commissionPers: { type: DataTypes.INTEGER, defaultValue: 25 },
    status: { type: DataTypes.BOOLEAN, defaultValue: true },
    departmentId: { type: DataTypes.INTEGER, allowNull: true },
    createdBy: { type: DataTypes.INTEGER },
    otp: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    otp_expiration: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    provisionAccId: { type: DataTypes.INTEGER },
    commissionAccId: { type: DataTypes.INTEGER },
    shiftId: { type: DataTypes.INTEGER },
    scheduleId: { type: DataTypes.INTEGER },
    workTimeStart: { type: DataTypes.TIME },
    workTimeEnd: { type: DataTypes.TIME },
}, {
    tableName: "companyStaffs"
})
export default usersTable
