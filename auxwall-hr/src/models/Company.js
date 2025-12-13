import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
const Company = sequelize.define("company", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
},
    {
        tableName: "company",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);
export default Company;