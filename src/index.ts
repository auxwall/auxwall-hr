import { initModels } from "./models/index.js";
import { setupRoutes } from "./router.js";
import { updateAttendanceSummary } from "./utils/attendenceLogic.js";
import { syncAttendence } from "./utils/attendenceSync.js";
import fs from 'fs';
import { Sequelize } from 'sequelize';
import { Express, Router } from 'express';
import { UserModels, HRModels } from './types.js';

interface HROptions {
    app: Express;
    sequelize: Sequelize;
    userModels: UserModels;
    uploadPath: string;
    path?: string;
    autoSync?: boolean;
}

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
    userModels,
    uploadPath,
    path = '/api/hr',
    autoSync = false
}: HROptions): Promise<{ hrModels: HRModels; hrRouter: Router }> => {
    try {
        if (!uploadPath) {
            throw new Error("Initialization Failed: 'uploadPath' must be provided to the HR Module for document storage.");
        }

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
            console.log(`Created storage directory at: ${uploadPath}`);
        }

        const hrModels = initModels(sequelize, userModels);

        if (autoSync) {
            await hrModels.Category.sync({ alter: true });
            await hrModels.Document.sync({ alter: true });
            await hrModels.Activity.sync({ alter: true });
            await hrModels.StaffShift.sync({ alter: true });
            await hrModels.AttendenceSummary.sync({ alter: true });
            console.log("HR Module tables synced.");
        }
        try {
            await syncAttendence(hrModels);
        } catch (error) {
            console.log("Failed to sync attendence", error);
        }

        userModels.Punching.addHook('afterCreate', 'autoUpdateAttendance', async (punch) => {
            try {
                await updateAttendanceSummary(punch as any, hrModels);
            } catch (error) {
                console.error("Attendance Automation Error:", error);
            }
        });

        console.log("HR Module initialized with automatic attendance tracking.");

        const hrRouter = setupRoutes(hrModels, uploadPath);
        app.use(path, hrRouter);

        console.log(`Auxwall HR Module mounted on ${path}`);

        return { hrModels, hrRouter };
    } catch (error) {
        console.error("HR Module failed to initialize:", error);
        throw error;
    }
};