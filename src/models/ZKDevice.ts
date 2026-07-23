import { DataTypes } from "sequelize";

export const defineZKDeviceTable = (sequelize) => {
    const ZKDevice = sequelize.define("ZKDevice", {
        serialNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        deviceName: DataTypes.STRING,

        ipAddress: DataTypes.STRING,

        firmwareVersion: DataTypes.STRING,

        remoteRegistrationSupported: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        faceSupported: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        fingerprintSupported: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        lastSeen: DataTypes.DATE
    },
        {
            tableName: "zkdevice",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at"
        });
    return ZKDevice;
};