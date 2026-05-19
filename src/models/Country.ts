import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

export const countryList = sequelize.define("country", {
    country: { type: DataTypes.TEXT },
    code: { type: DataTypes.INTEGER }
}, {
    tableName: "Countries"
});
export default countryList;
