// src/index.js
import router from "./router.js";
// Import both the sequelize instance AND the helper function
import { sequelize, useSharedDatabase } from "./config/database.js";
import { Company, Staff, Categories, Document, Activities } from "./models/index.js";
import "./models/association.js";

/**
 * Utility to sync only HR-specific tables. 
 */
export const syncHRModels = async (options = { alter: true }) => {
    await Categories.sync(options);
    await Document.sync(options);
    await Activities.sync(options);
    console.log("HR Module tables synchronized.");
};

export {
    router as hrRouter,
    sequelize as hrSequelize,
    useSharedDatabase,
    Company,
    Staff,
    Categories,
    Document,
    Activities
};