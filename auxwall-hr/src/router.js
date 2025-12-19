import express from "express";
import { validate } from "./middleware/validate.js";
import { categoryBodySchema, categoryIdSchema, updateCategorySchema } from "./schema/category.schema.js";

import { getCompany } from "./Controller/CompanyController/getCompany.js";
import { createCompany } from "./Controller/CompanyController/createCompany.js";
import { getStaff } from "./Controller/StaffController/getStaff.js";
import { createStaff } from "./Controller/StaffController/createStaff.js";
import { createActivity } from "./Controller/ActivitiesController/createActivity.js";
import { getActivities } from "./Controller/ActivitiesController/getActivities.js";
import { getCategories } from "./Controller/CategoriesController/getCategories.js";
import { createCategory } from "./Controller/CategoriesController/createCategory.js";
import { updateCategory } from "./Controller/CategoriesController/updateCategory.js";
import { deleteCategory } from "./Controller/CategoriesController/deleteCategory.js";
import { getDocuments } from "./Controller/DocumentsController/getDocuments.js";
import { getDocument } from "./Controller/DocumentsController/getDocument.js";
import { createDocument } from "./Controller/DocumentsController/createDocument.js";
import { updateDocument } from "./Controller/DocumentsController/updateDocument.js";
import { deleteDocument } from "./Controller/DocumentsController/deleteDocument.js";
import { getHrDashboard } from "./Controller/DashboardController/getHrDashboard.js";
import { getSummary } from "./Controller/DashboardController/getSummary.js";
import { getNearExpiryDocuments } from "./Controller/DashboardController/getNearExpiryDocuments.js";
import { getRecentActivities } from "./Controller/DashboardController/getRecentActivities.js";
import { getByCategory } from "./Controller/DashboardController/getByCategory.js";
import { staffBodySchema } from "./schema/staff.schema.js";
import { companyBodySchema } from "./schema/company.schema.js";
import { activitiesBodySchema } from "./schema/activities.schema.js";
import { paginationQuerySchema } from "./schema/pagination.schema.js";
import { documentBodySchema, documentIdSchema, updateDocumentSchema } from "./schema/document.schema.js";
import { categorizedSearchSchema } from "./schema/categorizedSearch.schema.js";
import { upload } from "./middleware/upload.js";
const router = express.Router();

router.get("/auxwall", (req, res) => {
    res.send("Company API running...!");
});
router.get("/auxwall/companies", validate(paginationQuerySchema), getCompany);
router.post("/auxwall/companies", validate(companyBodySchema), createCompany);
router.post("/auxwall/staffs", validate(staffBodySchema), createStaff);
router.get("/auxwall/staffs", validate(paginationQuerySchema), getStaff);
router.post("/auxwall/activities", validate(activitiesBodySchema), createActivity);
router.get("/auxwall/activities", validate(paginationQuerySchema, 'query'), getActivities);
router.get("/auxwall/hr_categories", validate(paginationQuerySchema), getCategories);
router.post("/auxwall/hr_categories", validate(categoryBodySchema), createCategory);
router.put("/auxwall/hr_categories/:id", validate(categoryIdSchema, 'params'), validate(updateCategorySchema), updateCategory);
router.delete("/auxwall/hr_categories/:id", validate(categoryIdSchema, 'params'), validate(categoryBodySchema), deleteCategory);
router.get("/auxwall/hr_documents", validate(paginationQuerySchema), getDocuments);
router.get("/auxwall/hr_documents/:id", validate(documentIdSchema, 'params'), getDocument);
router.post("/auxwall/hr_documents", upload.single("myFile"), validate(documentBodySchema), createDocument);
router.put("/auxwall/hr_documents/:id", upload.single("myFile"), validate(documentIdSchema, 'params'), validate(updateDocumentSchema), updateDocument);
router.delete("/auxwall/hr_documents/:id", validate(documentIdSchema, 'params'), validate(documentIdSchema, 'params'), deleteDocument);
router.get("/auxwall/hr_dashboard", getHrDashboard);
router.get("/auxwall/hr_dashboard/categories/summary", getSummary);
router.get("/auxwall/hr_dashboard/expiry/near", getNearExpiryDocuments);
router.get("/auxwall/hr_dashboard/activities/recent", getRecentActivities);
router.get("/auxwall/hr_documents/search/categorized", validate(categorizedSearchSchema, 'query'), getByCategory);

export default router;

