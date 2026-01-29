import { DataTypes } from "sequelize";

export const defineStaffShift = (sequelize) => {
    const staffShift = sequelize.define("staffShift", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uploadedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "uploaded_by"
        },
        shiftName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "shift_name"
        },
        shiftStart: {
            type: DataTypes.TIME,
            allowNull: false,
            field: "shift_start"
        },
        shiftEnd: {
            type: DataTypes.TIME,
            allowNull: false,
            field: "shift_end"
        },
        breakMinutes: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "break_minutes"
        },
        lateGraceMinutes: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "late_grace_minutes"
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
    }, {
        tableName: "staff_shifts"
    })
    return staffShift;
} 