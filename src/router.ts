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

import { viewAllotedShifts } from "./Controller/StaffAttendenceController/ShiftAllotment/viewAllotedShifts.js";
import { viewShiftByIdController } from "./Controller/StaffAttendenceController/ShiftAllotment/viewShiftById.js";

import { createShift } from "./Controller/StaffAttendenceController/StaffShiftsController/createShift.js";
import { viewShifts } from "./Controller/StaffAttendenceController/StaffShiftsController/viewShifts.js";
import { editShift } from "./Controller/StaffAttendenceController/StaffShiftsController/editShift.js";
import { deleteShift } from "./Controller/StaffAttendenceController/StaffShiftsController/deleteShift.js";
import { viewShiftById } from "./Controller/StaffAttendenceController/StaffShiftsController/viewShiftById.js";
import { viewAllShifts } from "./Controller/StaffAttendenceController/StaffShiftsController/viewAllShifts.js";

import { viewAttendenceSummary } from "./Controller/StaffAttendenceController/AttendenceSummary/viewAttendenceSummary.js";
import { monthlyReport } from "./Controller/StaffAttendenceController/AttendenceSummary/monthlyReport.js";
import { getAttendenceStatus } from "./Controller/StaffAttendenceController/AttendenceSummary/getAttendenceStatus.js";
import { updateUnauthorizedAttendence } from "./Controller/StaffAttendenceController/AttendenceSummary/updateUnauthorizedAttendence.js";
import { deleteUnauthorizedAttendence } from "./Controller/StaffAttendenceController/AttendenceSummary/deleteUnauthorizedAttendence.js";

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
import { attendenceById } from "./Controller/StaffAttendenceController/AttendenceSummary/attendanceById.js";
import { updatePunch } from "./Controller/StaffAttendenceController/AttendenceSummary/updatePunch.js";
import { getAbsentStaffController } from "./Controller/StaffAttendenceController/AttendenceSummary/getAbsentStaff.js";
import { updateScheduleController } from "./Controller/ScheduleController/updateSchedule.js";
import { allotShift } from "./Controller/StaffAttendenceController/ShiftAllotment/allotShift.js";

import { createDevice } from "./Controller/DeviceController/createDevice.js";
import { getAllDevices } from "./Controller/DeviceController/getAllDevices.js";
import { deleteDevice } from "./Controller/DeviceController/deleteDevice.js";
import { editDevice } from "./Controller/DeviceController/editDevice.js";
import { getDeviceById } from "./Controller/DeviceController/getDeviceById.js";
import { getAllSchedule } from "./Controller/ScheduleController/getAllSchedule.js";

import { registerFace } from "./Controller/ZKController/registerFace.js";
import { getZkCommands } from "./Controller/ZKController/getZkCommands.js";
import { receiveBioData } from "./Controller/ZKController/receiveBioData.js";
import { registerDevice } from "./Controller/ZKController/registerDevice.js";

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

    //Shift Allotment

    router.get("/shift_allotment/:id", validate(paginationQuerySchema), injectModels(viewAllotedShifts));
    router.get("/shift_allotment/view/:id", injectModels(viewShiftByIdController));
    router.put("/shift_allotment/update/:id", injectModels(allotShift));

    //Staff Shifts
    router.get("/all_staff_shifts/:id", injectModels(viewAllShifts));
    router.post("/staff_shifts", validate(shiftBodySchema), injectModels(createShift));
    router.get("/staff_shifts/:id", validate(paginationQuerySchema), injectModels(viewShifts));
    router.get("/staff_shift/:id", validate(shiftIdSchema, 'params'), injectModels(viewShiftById));
    router.put("/staff_shifts/:id", validate(shiftIdSchema, 'params'), validate(updateShiftSchema), injectModels(editShift));
    router.delete("/staff_shifts/:id", validate(shiftIdSchema, 'params'), injectModels(deleteShift));

    //Attendence Summary
    router.get("/staff_attendence_summary/:id", validate(paginationQuerySchema), injectModels(viewAttendenceSummary));
    router.get("/attendence_by_id/:id", injectModels(attendenceById))
    router.get("/staff_attendence_summary/monthly_report/:id", injectModels(monthlyReport));
    router.get("/attendence_status", injectModels(getAttendenceStatus));
    router.put("/unauthorized_attendence/:id", injectModels(updateUnauthorizedAttendence));
    router.put("/update_punch/:id", injectModels(updatePunch));
    router.delete("/unauthorized_attendence/:id", injectModels(deleteUnauthorizedAttendence));
    router.get("/absent_staff", validate(paginationQuerySchema), injectModels(getAbsentStaffController));

    //Departments
    router.get("/departments/:id", validate(paginationQuerySchema), injectModels(getDepartments));
    router.put("/departments/:id", validate(departmentIdSchema, 'params'), injectModels(updateDepartment));
    router.get("/department/:id", validate(departmentIdSchema, 'params'), injectModels(getDepartmentById));
    router.delete("/department/:id", validate(departmentIdSchema, 'params'), injectModels(deleteDepartment));
    // router.get("/user/:companyId", validate(paginationQuerySchema), injectModels(getStaffByDepartment));
    // router.get("/user/:companyId", validate(paginationQuerySchema), injectModels(getStaffByStatus));
    router.post("/departments", validate(departmentBodySchema), injectModels(createDepartment));

    //Devices
    router.post("/device", injectModels(createDevice));
    router.get("/devices/:companyId", validate(paginationQuerySchema), injectModels(getAllDevices));
    router.get("/device/:id", injectModels(getDeviceById));
    router.put("/device/:id", injectModels(editDevice));
    router.delete("/device/:id", injectModels(deleteDevice));

    router.post("/schedule", injectModels(createOrUpdateSchedule));
    router.get("/all_schedules/:id", injectModels(getAllSchedule));
    router.get("/schedules/:id", validate(paginationQuerySchema), injectModels(getSchedule));
    router.get("/schedule/:id", injectModels(getScheduleById));
    router.delete("/schedule/:id", injectModels(deleteSchedule));
    router.put("/schedule/:id", injectModels(updateScheduleController));
    // router.put("/departments/:id", validate(departmentIdSchema, 'params'), validate(updateDepartmentSchema), injectModels(updateDepartment));
    // router.delete("/departments/:id", validate(departmentIdSchema, 'params'), injectModels(deleteDepartment));

    router.post("/zk/register-face", injectModels(registerFace));
    router.get("/iclock/cdata", injectModels(getZkCommands));
    router.post("/iclock/cdata", express.text({ type: "*/*" }), injectModels(receiveBioData));
    router.post("/iclock/registry", injectModels(registerDevice));

    return router;
}


