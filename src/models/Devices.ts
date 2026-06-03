import { DataTypes } from "sequelize";

export const defineDevice = (sequelize) => {
    const Device = sequelize.define(
        "device",
        {
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

            deviceName: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "device_name"
            },

            serialNumber: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                field: "serial_number"
            },

            deviceKey: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "device_key"
            },

            ipAddress: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "ip_address"
            },

            port: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 8000,
                field: "port"
            },

            location: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "location"
            },

            model: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "device_model"
            },

            manufacturer: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: "Hikvision",
                field: "manufacturer"
            },

            status: {
                type: DataTypes.ENUM(
                    "Active",
                    "Inactive",
                    "Disconnected"
                ),
                defaultValue: "Active",
                allowNull: false,
                field: "status"
            },

            lastSyncAt: {
                type: DataTypes.DATE,
                allowNull: true,
                field: "last_sync_at"
            },

            remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: "remarks"
            },

            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: "created_by"
            }
        },
        {
            tableName: "hr_devices",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    );

    return Device;
};