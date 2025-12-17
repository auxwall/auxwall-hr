import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
const Staff = sequelize.define("staff", {
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
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true
    },
    zip: {
        type: DataTypes.STRING,
        allowNull: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "company",
            key: "id"
        }
    }, designation: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "staffs"
})
export default Staff