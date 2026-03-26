import express from "express";
import { saveBias, getBiasHistory } from "../controllers/biasController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Save Bias (Protected)
router.post("/save", verifyToken, saveBias);

// ✅ Get Bias History (Protected)
router.get("/history", verifyToken, getBiasHistory);

export default router;