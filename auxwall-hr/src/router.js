import express from "express";
import * as hrController from "./hrContoller.js";
const router = express.Router();

router.get("/auxwall", (req, res) => {
    res.send("Company API running...!");
});
router.get("/auxwall/hr_categories", hrController.getCategories);
router.post("/auxwall/hr_categories", hrController.createCategory);
router.put("/auxwall/hr_categories/:id", hrController.updateCategory);
router.delete("/auxwall/hr_categories/:id", hrController.deleteCategory);
router.get("/auxwall/hr_documents", hrController.getDocuments);
router.get("/auxwall/hr_documents/:id", hrController.getDocument);
router.post("/auxwall/hr_documents", hrController.createDocument);
router.get("/auxwall/hr_dashboard", hrController.getHrDashboard);
router.get("/auxwall/hr_dashboard/categories/summary", hrController.getSummary);
router.get("/auxwall/hr_dashboard/expiry/near", hrController.getNearExpiryDocuments);
router.get("/auxwall/hr_dashboard/activities/recent", hrController.getRecentActivities);
router.get("/auxwall/hr_documents/search/categorized", hrController.getByCategory);

export default router;

