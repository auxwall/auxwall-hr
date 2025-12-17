import express from "express";
import * as companyController from "./Controller/Company.js";
import * as staffController from "./Controller/Staff.js";
import * as categoriesController from "./Controller/Categories.js";
import * as documentsController from "./Controller/Documents.js";
import * as dashboardController from "./Controller/Dashboard.js";
const router = express.Router();

router.get("/auxwall", (req, res) => {
    res.send("Company API running...!");
});
router.get("/auxwall/companies", companyController.getCompany);
router.post("/auxwall/companies", companyController.createCompany);
router.post("/auxwall/staffs", staffController.createStaff);
router.get("/auxwall/staffs", staffController.getStaff);
router.get("/auxwall/hr_categories", categoriesController.getCategories);
router.post("/auxwall/hr_categories", categoriesController.createCategory);
router.put("/auxwall/hr_categories/:id", categoriesController.updateCategory);
router.delete("/auxwall/hr_categories/:id", categoriesController.deleteCategory);
router.get("/auxwall/hr_documents", documentsController.getDocuments);
router.get("/auxwall/hr_documents/:id", documentsController.getDocument);
router.post("/auxwall/hr_documents", documentsController.createDocument);
router.put("/auxwall/hr_documents/:id", documentsController.updateDocument);
router.delete("/auxwall/hr_documents/:id", documentsController.deleteDocument);
router.get("/auxwall/hr_dashboard", dashboardController.getHrDashboard);
router.get("/auxwall/hr_dashboard/categories/summary", dashboardController.getSummary);
router.get("/auxwall/hr_dashboard/expiry/near", dashboardController.getNearExpiryDocuments);
router.get("/auxwall/hr_dashboard/activities/recent", dashboardController.getRecentActivities);
router.get("/auxwall/hr_documents/search/categorized", dashboardController.getByCategory);

export default router;

