import { DataTypes } from "sequelize";

export const defineZKCommandTable = (sequelize) => {
    const ZKCommand = sequelize.define("ZKCommand", {
        serialNumber: DataTypes.STRING,

        commandText: DataTypes.TEXT,

        status: {
            type: DataTypes.ENUM(
                'pending',
                'sent',
                'completed',
                'failed'
            ),
            defaultValue: 'pending'
        }
    }, {
        tableName: "zkcommand",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    });
    return ZKCommand;
};