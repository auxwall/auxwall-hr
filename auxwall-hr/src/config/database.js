import { Sequelize } from "sequelize";
export let sequelize = new Sequelize("companydb", "postgres", "admin", {
    host: "localhost",
    dialect: "postgres",
    logging: false
});

export const useSharedDatabase = (externalSequelize) => {
    sequelize = externalSequelize;
    console.log("HR Module is now using the shared database connection.");
};