import express from "express";
import router from "./router.js";
import { sequelize } from "./config/database.js";
import "./models/association.js"
import { Company, Staff, Categories, Document, Activities } from "./models/index.js";
const app = express();
const Port = 3000;

app.use(express.json());
app.use(router);
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection has been established successfully.");
        await Company.sync({ alter: true });
        console.log("Company model synchronized.");

        await Staff.sync({ alter: true });
        console.log("Staff model synchronized.");

        await Categories.sync({ alter: true });
        console.log("Categories model synchronized.");

        await Document.sync({ alter: true });
        console.log("Document model synchronized.");

        await Activities.sync({ alter: true });
        console.log("Activities model synchronized.");

        // Explicitly create server using http module
        // This ensures tracking of the server handle
        const server = app.listen(Port, () => {
            console.log(`Server running on port ${Port}`);
        });

        server.on('error', (e) => {
            console.error('[DEBUG] Server Error:', e);
            process.exit(1);
        });

        // Debugging: check if server is listening
        console.log("Server instance created.");

        // DEBUG: Keep process alive and log exits
        setInterval(() => {
            console.log("Heartbeat: Server is still alive...");
        }, 5000); // Kept ref'd to prove if event loop is draining

        process.on('exit', (code) => {
            console.log(`[DEBUG] Process is exiting with code: ${code}`);
        });

        process.on('unhandledRejection', (reason, promise) => {
            console.error('[DEBUG] Unhandled Rejection at:', promise, 'reason:', reason);
        });

        process.on('uncaughtException', (error) => {
            console.error('[DEBUG] Uncaught Exception:', error);
        });

    } catch (err) {
        console.log(err);
    }
})();

// Remove process exit debugging for now to see clean behavior
