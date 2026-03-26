import express from "express";
import { saveSimulation, getUserSimulations, getRiskAnalytics } from "../controllers/SimulationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* SAVE SIMULATION */
router.post("/", verifyToken, saveSimulation);

/* FETCH USER HISTORY */
router.get("/", verifyToken, getUserSimulations);   // ADD THIS
router.get("/history", verifyToken, getUserSimulations);

router.get("/analytics", verifyToken, getRiskAnalytics);

export default router;