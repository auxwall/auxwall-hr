import express from "express";
import * as hrController from "./hrContoller.js";
const router = express.Router();

router.get("/auxwall", (req, res) => {
    res.send("Company API running...!");
});
router.get("/auxwall/hr_categories", hrController.getCategories);
router.post("/auxwall/hr_categories", hrController.createCategory);
// router.put("/hr_categories/:id", hrController.updateCategory);
// router.delete("/hr_categories/:id", hrController.deleteCategory);
router.get("/auxwall/hr_documents", hrController.getDocuments);
router.get("/auxwall/hr_documents/:id", hrController.getDocument);
router.post("/auxwall/hr_documents", hrController.createDocument);
// router.put("/hr_documents/:id", hrController.updateDocument);
// router.delete("/hr_documents/:id", hrController.deleteDocument);

export default router;

