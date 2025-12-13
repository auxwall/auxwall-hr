import express from "express";
const router = express.Router();

router.get("/auxwall", (req, res) => {
    res.send("Company API running...!");
});

export default router;

