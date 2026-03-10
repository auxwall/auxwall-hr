import express, { Request, Response, NextFunction, Router } from "express";
import { validate } from "./middleware/validate.js";
import { createUploadMiddleware } from "./middleware/upload.js";

import { categoryBodySchema, categoryIdSchema, updateCategorySchema } from "./schema/category.schema.js";
import { documentBodySchema, documentIdSchema, updateDocumentSchema } from "./schema/document.schema.js";
import { departmentBodySchema, departmentIdSchema, updateDepartmentSchema } from "./schema/department.schema.js";
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
import { getCategoryTree } from "./Controller/DashboardController/getCategoryTree.js";

import { getPunchingDetails } from "./Controller/StaffAttendenceController/PunchingController/getPunchingDetails.js";
import { markPunches } from "./Controller/StaffAttendenceController/PunchingController/markPunches.js";

import { createShift } from "./Controller/StaffAttendenceController/StaffShiftsController/createShift.js";
import { viewShifts } from "./Controller/StaffAttendenceController/StaffShiftsController/viewShifts.js";
import { editShift } from "./Controller/StaffAttendenceController/StaffShiftsController/editShift.js";
import { deleteShift } from "./Controller/StaffAttendenceController/StaffShiftsController/deleteShift.js";
import { viewShiftById } from "./Controller/StaffAttendenceController/StaffShiftsController/viewShiftById.js";

import { viewAttendenceSummary } from "./Controller/StaffAttendenceController/AttendenceSummary/viewAttendenceSummary.js";
import { monthlyReport } from "./Controller/StaffAttendenceController/AttendenceSummary/monthlyReport.js";
import { getAttendenceStatus } from "./Controller/StaffAttendenceController/AttendenceSummary/getAttendenceStatus.js";

import { HRModels } from "./types.js";
import { getDepartments } from "./Controller/DepartmentController/getDepartments.js";
import { createDepartment } from "./Controller/DepartmentController/createDepartment.js";
import { updateDepartment } from "./Controller/DepartmentController/updateDepartment.js";
import { getDepartmentById } from "./Controller/DepartmentController/getDepartmentById.js";
import { deleteDepartment } from "./Controller/DepartmentController/deleteDepartment.js";

import { createOrUpdateSchedule } from "./Controller/ScheduleController/createSchedule.js";
import { getSchedule } from "./Controller/ScheduleController/getSchedule.js";
import { getScheduleById } from "./Controller/ScheduleController/getScheduleById.js";
import { deleteSchedule } from "./Controller/ScheduleController/deleteSchedule.js";

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
    router.get("/activities/:id", validate(paginationQuerySchema, 'query'), injectModels(getActivities));

    //Categories
    router.get("/hr_categories/:id", validate(paginationQuerySchema), injectModels(getCategories));
    router.post("/hr_categories", validate(categoryBodySchema), injectModels(createCategory));
    router.put("/hr_categories/:id", validate(categoryIdSchema, 'params'), validate(updateCategorySchema), injectModels(updateCategory));
    router.delete("/hr_categories/:id", validate(categoryIdSchema, 'params'), injectModels(deleteCategory));

    //Documents
    router.get("/document/:companyId", validate(paginationQuerySchema), injectModels(getDocuments));
    router.get("/hr_documents/:id", validate(documentIdSchema, 'params'), injectModels(getDocument));
    router.post("/hr_documents", upload.single("image"), validate(documentBodySchema), injectContext(createDocument));
    router.put("/hr_documents/:id", upload.single("image"), validate(documentIdSchema, 'params'), validate(updateDocumentSchema), injectContext(updateDocument));
    router.delete("/hr_documents/:id", validate(documentIdSchema, 'params'), injectContext(deleteDocument));

    //Dashboard
    router.get("/hr_dashboard/:id", injectModels(getHrDashboard));
    router.get("/hr_dashboard/categories/summary/:id", injectModels(getSummary));
    router.get("/hr_dashboard/expiry/near/:id", injectModels(getNearExpiryDocuments));
    router.get("/hr_dashboard/activities/recent/:id", injectModels(getRecentActivities));
    router.get("/hr_documents/search/categorized/:id", validate(categorizedSearchSchema, 'query'), injectModels(getByCategory));
    router.get("/hr_documents/search/categoryTree/:id", injectModels(getCategoryTree));

    //Staff Attendence
    router.post("/staff_attendence", injectModels(markPunches));
    router.get("/staff_attendence/:id", validate(paginationQuerySchema), injectModels(getPunchingDetails));

    //Staff Shifts
    router.post("/staff_shifts", validate(shiftBodySchema), injectModels(createShift));
    router.get("/staff_shifts/:id", validate(paginationQuerySchema), injectModels(viewShifts));
    router.get("/staff_shift/:id", validate(shiftIdSchema, 'params'), injectModels(viewShiftById));
    router.put("/staff_shifts/:id", validate(shiftIdSchema, 'params'), validate(updateShiftSchema), injectModels(editShift));
    router.delete("/staff_shifts/:id", validate(shiftIdSchema, 'params'), injectModels(deleteShift));

    //Attendence Summary
    router.get("/staff_attendence_summary/:id", validate(paginationQuerySchema), injectModels(viewAttendenceSummary));
    router.get("/staff_attendence_summary/monthly_report/:id", injectModels(monthlyReport));
    router.get("/attendence_status", injectModels(getAttendenceStatus));


    //Departments
    router.get("/departments/:id", validate(paginationQuerySchema), injectModels(getDepartments));
    router.put("/departments/:id", validate(departmentIdSchema, 'params'), injectModels(updateDepartment));
    router.get("/department/:id", validate(departmentIdSchema, 'params'), injectModels(getDepartmentById));
    router.delete("/department/:id", validate(departmentIdSchema, 'params'), injectModels(deleteDepartment));
    // router.get("/user/:companyId", validate(paginationQuerySchema), injectModels(getStaffByDepartment));
    // router.get("/user/:companyId", validate(paginationQuerySchema), injectModels(getStaffByStatus));
    router.post("/departments", validate(departmentBodySchema), injectModels(createDepartment));


    router.post("/schedule", injectModels(createOrUpdateSchedule));
    router.get("/schedules/:id", injectModels(getSchedule));
    router.get("/schedule/:id", injectModels(getScheduleById));
    router.delete("/schedule/:id", injectModels(deleteSchedule));
    // router.put("/departments/:id", validate(departmentIdSchema, 'params'), validate(updateDepartmentSchema), injectModels(updateDepartment));
    // router.delete("/departments/:id", validate(departmentIdSchema, 'params'), injectModels(deleteDepartment));

    return router;
}


