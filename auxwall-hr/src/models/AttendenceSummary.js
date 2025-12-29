import { DataTypes } from "sequelize";

export const defineAttendenceSummary = (sequelize) => {
    const AttendenceSummary = sequelize.define("attendenceSummary", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        staffId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "staff_id"
        },
        clientId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "client_id"
        },
        attendenceDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            field: "attendence_date"
        },
        shiftStart: {
            type: DataTypes.TIME,
            allowNull: true,
            field: "shift_start"
        },
        shiftEnd: {
            type: DataTypes.TIME,
            allowNull: true,
            field: "shift_end"
        },
        first_in: {
            type: DataTypes.TIME,
            allowNull: true,
            field: "first_in"
        },
        last_out: {
            type: DataTypes.TIME,
            allowNull: true,
            field: "last_out"
        },
        workedMinutes: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "worked_minutes"
        },
        lateMinutes: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "late_minutes"
        },
        overtimeMinutes: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "overtime_minutes"
        },
        breakMinutes: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "break_minutes"
        },
        totalPunches: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: "total_punches"
        },
        status: {
            type: DataTypes.ENUM("Present", "Late", "Absent", "Half Day", "Leave"),
            allowNull: true,
            field: "status"
        }

    }, {
        tableName: "attendence_summary",
        timestamps: true,
        createdAt: "created_at",
        indexes: [
            {
                unique: true,
                fields: ['staff_id', 'attendence_date']
            },
            {
                unique: true,
                fields: ['client_id', 'attendence_date']
            }
        ]
    })
    return AttendenceSummary;
}
