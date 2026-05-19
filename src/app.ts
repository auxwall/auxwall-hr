// import express from 'express';
// import * as path from 'path';
// import fs from 'fs';

// import { sequelize } from './config/database.js';
// import { initModels } from './models/index.js';

// import { setupRoutes } from './router.js';
// import { insertFakeAttendance } from './utils/insertFakeAttendence.js';

// import { syncAttendence } from './utils/attendenceSync.js';
// import { syncDocStatus } from './utils/syncDocStatus.js';

// const app = express();
// app.use(express.json());

// const startServer = async () => {

//     console.log("🚀 STARTING HR SERVER...");

//     try {

//         /* =========================
//            UPLOAD DIRECTORY
//         ========================= */
//         console.log("1️⃣ Checking upload directory...");

//         const uploadPath = path.resolve('./uploads/hr_documents');

//         if (!fs.existsSync(uploadPath)) {
//             fs.mkdirSync(uploadPath, { recursive: true });
//             console.log(`📁 Created upload folder: ${uploadPath}`);
//         } else {
//             console.log("📁 Upload folder already exists");
//         }

//         /* =========================
//            DATABASE CONNECTION
//         ========================= */
//         console.log("2️⃣ Connecting database...");

//         await sequelize.authenticate();

//         console.log("✅ Database connected successfully");

//         /* =========================
//            INIT MODELS
//         ========================= */
//         console.log("3️⃣ Initializing models...");

//         const hrModels = initModels(sequelize);

//         console.log("✅ Models initialized");

//         /* =========================
//            SYNC TABLES
//         ========================= */
//         console.log("4️⃣ Syncing database tables...");

//         await sequelize.sync({ alter: true });

//         console.log("✅ All tables synced");

//         /* =========================
//            FAKE ATTENDANCE TEST
//         ========================= */
//         console.log("5️⃣ Running fake attendance test...");

//         try {

//             console.log("🧪 Inserting fake attendance...");

//             await insertFakeAttendance(hrModels, {
//                 staffId: 1,
//                 companyId: 1,
//                 eventDate: new Date("2026-05-07T23:56:00")
//             });

//             console.log("✅ Fake attendance inserted");

//         } catch (error) {
//             console.error("❌ Fake attendance failed:", error);
//         }

//         /* =========================
//            ATTENDANCE SYNC
//         ========================= */
//         console.log("6️⃣ Running attendance sync...");

//         try {
//             await syncAttendence(hrModels);
//             console.log("✅ Attendance sync completed");
//         } catch (error) {
//             console.error("❌ Attendance sync failed:", error);
//         }

//         /* =========================
//            DOC STATUS SYNC
//         ========================= */
//         console.log("7️⃣ Running document status sync...");

//         try {
//             await syncDocStatus(hrModels);
//             console.log("✅ Document status synced");
//         } catch (error) {
//             console.error("❌ Document status sync failed:", error);
//         }

//         /* =========================
//            ROUTES SETUP
//         ========================= */
//         console.log("8️⃣ Setting up routes...");

//         const hrRouter = setupRoutes(hrModels, uploadPath);

//         console.log("🧭 HR router loaded");

//         app.use('/api/hr', hrRouter);

//         console.log("✅ Routes mounted at /api/hr");

//         /* =========================
//            TEST ROUTES
//         ========================= */
//         app.get('/', (req, res) => {
//             console.log("🏠 GET / hit");
//             res.send('HR Backend Running Successfully');
//         });

//         app.get('/api/hr', (req, res) => {
//             console.log("🏠 GET /api/hr hit");
//             res.json({
//                 success: true,
//                 message: 'HR Module Working'
//             });
//         });

//         /* =========================
//            START SERVER
//         ========================= */
//         const PORT = 3000;

//         console.log("9️⃣ Starting server...");

//         app.listen(PORT, () => {
//             console.log(`🚀 Server running on http://localhost:${PORT}`);
//         });

//     } catch (error) {
//         console.error("❌ SERVER START FAILED:", error);
//     }
// };

// startServer();

import express from 'express';
import * as path from 'path';
import fs from 'fs';

import { sequelize } from './config/database.js';
import { initModels } from './models/index.js';

import { setupRoutes } from './router.js';
import { insertFakeAttendance } from './utils/insertFakeAttendence.js';

import { syncAttendence } from './utils/attendenceSync.js';
import { syncDocStatus } from './utils/syncDocStatus.js';
import { updateAttendanceSummary } from './utils/attendenceLogic.js';

const app = express();
app.use(express.json());

const startServer = async () => {

    console.log("🚀 STARTING HR SERVER...");

    try {

        /* =========================
           UPLOAD DIRECTORY
        ========================= */
        console.log("1️⃣ Checking upload directory...");

        const uploadPath = path.resolve('./uploads/hr_documents');

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
            console.log(`📁 Created upload folder: ${uploadPath}`);
        } else {
            console.log("📁 Upload folder already exists");
        }

        /* =========================
           DATABASE CONNECTION
        ========================= */
        console.log("2️⃣ Connecting database...");

        await sequelize.authenticate();

        console.log("✅ Database connected successfully");

        /* =========================
           INIT MODELS
        ========================= */
        console.log("3️⃣ Initializing models...");

        const hrModels = initModels(sequelize);

        console.log("✅ Models initialized");

        /* =========================
           SYNC TABLES
        ========================= */
        console.log("4️⃣ Syncing database tables...");

        await sequelize.sync({ alter: true });
        /* =========================
           FAKE ATTENDANCE TEST
        ========================= */
        console.log("5️⃣ Running fake attendance test...");

        try {

            console.log("🧪 Inserting fake attendance...");

            const result = await insertFakeAttendance(hrModels, {
                staffId: 2,
                companyId: 1,
                eventDate: new Date("2026-05-10T23:48:00")
            });

            console.log("📦 Fake attendance result:", result);

            // =========================
            // AUTO UPDATE SUMMARY
            // =========================
            if (result?.attendance) {

                console.log("🔄 Updating attendance summary...");

                const attendanceData = Array.isArray(result.attendance)
                    ? result.attendance
                    : [result.attendance];

                await updateAttendanceSummary(attendanceData, hrModels);

                console.log("✅ Attendance summary updated");
            }

            console.log("✅ Fake attendance inserted");
            // const shifts = await hrModels.StaffShift.findAll();
            // console.log("ALL SHIFTS:", shifts);

        } catch (error) {
            console.error("❌ Fake attendance failed:", error);
        }

        /* =========================
           ATTENDANCE SYNC
        ========================= */
        console.log("6️⃣ Running attendance sync...");

        try {
            await syncAttendence(hrModels);
            console.log("✅ Attendance sync completed");
        } catch (error) {
            console.error("❌ Attendance sync failed:", error);
        }

        /* =========================
           DOC STATUS SYNC
        ========================= */
        console.log("7️⃣ Running document status sync...");

        try {
            await syncDocStatus(hrModels);
            console.log("✅ Document status synced");
        } catch (error) {
            console.error("❌ Document status sync failed:", error);
        }

        /* =========================
           ROUTES SETUP
        ========================= */
        console.log("8️⃣ Setting up routes...");

        const hrRouter = setupRoutes(hrModels, uploadPath);

        console.log("🧭 HR router loaded");

        app.use('/api/hr', hrRouter);

        console.log("✅ Routes mounted at /api/hr");

        /* =========================
           TEST ROUTES
        ========================= */
        app.get('/', (req, res) => {
            console.log("🏠 GET / hit");
            res.send('HR Backend Running Successfully');
        });

        app.get('/api/hr', (req, res) => {
            console.log("🏠 GET /api/hr hit");
            res.json({
                success: true,
                message: 'HR Module Working'
            });
        });

        /* =========================
           START SERVER
        ========================= */
        const PORT = 3000;

        console.log("9️⃣ Starting server...");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ SERVER START FAILED:", error);
    }
};

startServer();