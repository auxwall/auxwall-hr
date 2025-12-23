import express from "express";
import { validate } from "./middleware/validate.js";
import { createUploadMiddleware } from "./middleware/upload.js";

import { categoryBodySchema, categoryIdSchema, updateCategorySchema } from "./schema/category.schema.js";
import { activitiesBodySchema } from "./schema/activities.schema.js";
import { paginationQuerySchema } from "./schema/pagination.schema.js";
import { documentBodySchema, documentIdSchema, updateDocumentSchema } from "./schema/document.schema.js";
import { categorizedSearchSchema } from "./schema/categorizedSearch.schema.js";

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

export const setupRoutes = (hrModels, uploadPath) => {
    const router = express.Router();
    const upload = createUploadMiddleware(uploadPath);

    const injectModels = (controller) => (req, res) => controller(req, res, hrModels);
    const injectContext = (controller) => (req, res) => controller(req, res, hrModels, uploadPath);

    router.get("/", (req, res) => {
        res.send("Auxwall HR Module API running...!");
    });

    //Company & Staff
    router.get("/companies", validate(paginationQuerySchema), injectModels(getCompany));
    router.post("/companies", injectModels(createCompany));
    router.post("/staffs", injectModels(createStaff));
    router.get("/staffs", validate(paginationQuerySchema), injectModels(getStaff));

    //Activities
    router.post("/activities", validate(activitiesBodySchema), injectModels(createActivity));
    router.get("/activities", validate(paginationQuerySchema, 'query'), injectModels(getActivities));

    //Categories
    router.get("/hr_categories", validate(paginationQuerySchema), injectModels(getCategories));
    router.post("/hr_categories", validate(categoryBodySchema), injectModels(createCategory));
    router.put("/hr_categories/:id", validate(categoryIdSchema, 'params'), validate(updateCategorySchema), injectModels(updateCategory));
    router.delete("/hr_categories/:id", validate(categoryIdSchema, 'params'), injectModels(deleteCategory));

    //Documents
    router.get("/hr_documents", validate(paginationQuerySchema), injectModels(getDocuments));
    router.get("/hr_documents/:id", validate(documentIdSchema, 'params'), injectModels(getDocument));
    router.post("/hr_documents", upload.single("myFile"), validate(documentBodySchema), injectContext(createDocument));
    router.put("/hr_documents/:id", upload.single("myFile"), validate(documentIdSchema, 'params'), validate(updateDocumentSchema), injectContext(updateDocument));
    router.delete("/hr_documents/:id", validate(documentIdSchema, 'params'), injectContext(deleteDocument));

    //Dashboard
    router.get("/hr_dashboard", injectModels(getHrDashboard));
    router.get("/hr_dashboard/categories/summary", injectModels(getSummary));
    router.get("/hr_dashboard/expiry/near", injectModels(getNearExpiryDocuments));
    router.get("/hr_dashboard/activities/recent", injectModels(getRecentActivities));
    router.get("/hr_documents/search/categorized", validate(categorizedSearchSchema, 'query'), injectModels(getByCategory));

    return router;

}


