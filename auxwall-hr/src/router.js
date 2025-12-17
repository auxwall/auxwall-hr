import express from "express";
import { validate } from "./middleware/validate.js";
import { categoryBodySchema, categoryIdSchema } from "./schema/category.schema.js";
import * as companyController from "./Controller/Company.js";
import * as staffController from "./Controller/Staff.js";
import * as categoriesController from "./Controller/Categories.js";
import * as documentsController from "./Controller/Documents.js";
import * as dashboardController from "./Controller/Dashboard.js";
import { staffBodySchema } from "./schema/staff.schema.js";
import { companyBodySchema } from "./schema/company.schema.js";
import * as activitiesController from "./Controller/Activities.js";
import { activitiesBodySchema } from "./schema/activities.schema.js";
import { documentBodySchema, documentIdSchema } from "./schema/document.schema.js";
const router = express.Router();

router.get("/auxwall", (req, res) => {
    res.send("Company API running...!");
});
router.get("/auxwall/companies", companyController.getCompany);
router.post("/auxwall/companies", validate(companyBodySchema), companyController.createCompany);
router.post("/auxwall/staffs", validate(staffBodySchema), staffController.createStaff);
router.get("/auxwall/staffs", staffController.getStaff);
router.post("/auxwall/activities", validate(activitiesBodySchema), activitiesController.createActivity);
router.get("/auxwall/activities", activitiesController.getActivities);
router.get("/auxwall/hr_categories", categoriesController.getCategories);
router.post("/auxwall/hr_categories", validate(categoryBodySchema), categoriesController.createCategory);
router.put("/auxwall/hr_categories/:id", validate(categoryIdSchema, 'params'), validate(categoryBodySchema), categoriesController.updateCategory);
router.delete("/auxwall/hr_categories/:id", validate(categoryIdSchema, 'params'), validate(categoryBodySchema), categoriesController.deleteCategory);
router.get("/auxwall/hr_documents", documentsController.getDocuments);
router.get("/auxwall/hr_documents/:id", validate(documentIdSchema, 'params'), documentsController.getDocument);
router.post("/auxwall/hr_documents", validate(documentBodySchema), documentsController.createDocument);
router.put("/auxwall/hr_documents/:id", validate(documentIdSchema, 'params'), validate(documentBodySchema), documentsController.updateDocument);
router.delete("/auxwall/hr_documents/:id", validate(documentIdSchema, 'params'), validate(documentBodySchema), documentsController.deleteDocument);
router.get("/auxwall/hr_dashboard", dashboardController.getHrDashboard);
router.get("/auxwall/hr_dashboard/categories/summary", dashboardController.getSummary);
router.get("/auxwall/hr_dashboard/expiry/near", dashboardController.getNearExpiryDocuments);
router.get("/auxwall/hr_dashboard/activities/recent", dashboardController.getRecentActivities);
router.get("/auxwall/hr_documents/search/categorized", dashboardController.getByCategory);

export default router;

