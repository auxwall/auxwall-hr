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

        app.listen(Port, () =>
            console.log(`Server running on port ${Port}`));
    } catch (err) {
        console.log(err);
    }
})(); // The error was that the immediately invoked async function expression (IIFE) was not being invoked.()
