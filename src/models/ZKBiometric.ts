import { DataTypes } from "sequelize";

export const defineZKBiometricTable = (sequelize) => {
    const ZKBiometric = sequelize.define("ZKBiometric", {

        staffId: DataTypes.INTEGER,

        biometricType: DataTypes.INTEGER,

        templateData: DataTypes.TEXT('long'),

        bioPhoto: DataTypes.TEXT('long'),

        majorVersion: DataTypes.INTEGER,

        minorVersion: DataTypes.INTEGER
    },
        {
            tableName: "zkbiometric",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at"
        });
    return ZKBiometric;
};