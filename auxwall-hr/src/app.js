import express from "express";
import { hrRouter, syncHRModels } from "./index.js";
import { sequelize } from "./config/database.js";

const app = express();
const Port = 3000;

app.use(express.json());
app.use(hrRouter); // Use the router exported from index.js

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Local Dev: Database connection established.");

        // We only sync HR models here. 
        // We assume Company and Staff already exist in the shared DB.
        await syncHRModels();

        const server = app.listen(Port, () => {
            console.log(`Test Server running on port ${Port}`);
        });

        // Error handling stays in app.js (the runner), not index.js (the library)
        server.on('error', (e) => {
            if (e.code === 'EADDRINUSE') {
                console.error(`Port ${Port} is already in use!`);
            }
            process.exit(1);
        });

    } catch (err) {
        console.error("Local Dev Boot Error:", err);
    }
})();