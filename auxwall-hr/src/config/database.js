import { Sequelize } from "sequelize";
export const sequelize = new Sequelize("companydb", "postgres", "admin", {
    host: "localhost",
    dialect: "postgres",
    logging: false
});

