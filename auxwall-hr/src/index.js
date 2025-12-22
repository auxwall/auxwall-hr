import { initModels } from "./models/index.js";
import { setupRoutes } from "./router.js";
import fs from 'fs';

/**
 * @param {Object} options
 * @param {Object} options.app
 * @param {Object} options.sequelize
 * @param {Object} options.models
 * @param {String} options.uploadPath 
 * @param {String} [options.path] 
 * @param {Boolean} [options.autoSync]
 */
export const initializeHRModule = async ({
    app,
    sequelize,
    models,
    uploadPath,
    path = '/api/hr',
    autoSync = false
}) => {
    try {
        if (!uploadPath) {
            throw new Error("Initialization Failed: 'uploadPath' must be provided to the HR Module for document storage.");
        }

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
            console.log(`Created storage directory at: ${uploadPath}`);
        }

        const hrModels = initModels(sequelize, models);

        if (autoSync) {
            await hrModels.Category.sync({ alter: true });
            await hrModels.Document.sync({ alter: true });
            await hrModels.Activity.sync({ alter: true });
            console.log("HR Module tables synced.");
        }

        const hrRouter = setupRoutes(hrModels, uploadPath);
        app.use(path, hrRouter);

        console.log(`Auxwall HR Module mounted on ${path}`);

        return { hrModels, hrRouter };
    } catch (error) {
        console.error("HR Module failed to initialize:", error);
        throw error;
    }
};