import express, { Request, Response, NextFunction, Router } from "express";
import { validate } from "./middleware/validate.js";
import { createUploadMiddleware } from "./middleware/upload.js";

import { categoryBodySchema, categoryIdSchema, updateCategorySchema } from "./schema/category.schema.js";
import { documentBodySchema, documentIdSchema, updateDocumentSchema } from "./schema/document.schema.js";
import { shiftBodySchema, shiftIdSchema, updateShiftSchema } from "./schema/shift.schema.js";
import { categorizedSearchSchema } from "./schema/categorizedSearch.schema.js";
import { activitiesBodySchema } from "./schema/activities.schema.js";
import { paginationQuerySchema } from "./schema/pagination.schema.js";

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

import { getPunchingDetails } from "./Controller/StaffAttendenceController/PunchingController/getPunchingDetails.js";
import { markPunches } from "./Controller/StaffAttendenceController/PunchingController/markPunches.js";

import { createShift } from "./Controller/StaffAttendenceController/StaffShiftsController/createShift.js";
import { viewShifts } from "./Controller/StaffAttendenceController/StaffShiftsController/viewShifts.js";
import { editShift } from "./Controller/StaffAttendenceController/StaffShiftsController/editShift.js";
import { deleteShift } from "./Controller/StaffAttendenceController/StaffShiftsController/deleteShift.js";

import { viewAttendenceSummary } from "./Controller/StaffAttendenceController/AttendenceSummary/viewAttendenceSummary.js";
import { monthlyReport } from "./Controller/StaffAttendenceController/AttendenceSummary/monthlyReport.js";
import { HRModels } from "./types.js";

export const setupRoutes = (hrModels: HRModels, uploadPath: string): Router => {
    const router = express.Router();
    const upload = createUploadMiddleware(uploadPath);

    const injectModels = (controller: Function) => (req: Request, res: Response, next: NextFunction) => controller(req, res, hrModels);
    const injectContext = (controller: Function) => (req: Request, res: Response, next: NextFunction) => controller(req, res, hrModels, uploadPath);

    router.get("/", (req: Request, res: Response) => {
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

    //Staff Attendence
    router.post("/staff_attendence", injectModels(markPunches));
    router.get("/staff_attendence", validate(paginationQuerySchema), injectModels(getPunchingDetails));

    //Staff Shifts
    router.post("/staff_shifts", validate(shiftBodySchema), injectModels(createShift));
    router.get("/staff_shifts", validate(paginationQuerySchema), injectModels(viewShifts));
    router.put("/staff_shifts/:id", validate(shiftIdSchema, 'params'), validate(updateShiftSchema), injectModels(editShift));
    router.delete("/staff_shifts/:id", validate(shiftIdSchema, 'params'), injectModels(deleteShift));

    //Attendence Summary
    router.get("/staff_attendence_summary", validate(paginationQuerySchema), injectModels(viewAttendenceSummary));
    router.get("/staff_attendence_summary/monthly_report", injectModels(monthlyReport));
    return router;

}


