import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

import {
  fetchAllUsers,
  removeUser,
  makeAdmin,
  getStats,
  demoteAdmin,
  getRecentActivity,
  getUserGrowth,
  saveSettings,
  getRiskDistribution,
  getStrategyPopularity
} from "../controllers/adminController.js";

const router = express.Router();

// USERS
router.get("/users", verifyToken, fetchAllUsers);
router.delete("/users/:id", verifyToken, removeUser);

// ROLE MANAGEMENT
router.put("/promote/:id", verifyToken, makeAdmin);
router.put("/demote/:id", verifyToken, demoteAdmin);

// DASHBOARD
router.get("/stats", verifyToken, getStats);
router.get("/user-growth", verifyToken, getUserGrowth);
router.get("/activity", verifyToken, getRecentActivity);

// SETTINGS
router.post("/settings", verifyToken, saveSettings);

// ANALYTICS
router.get("/risk-distribution", getRiskDistribution);
router.get("/strategy-popularity", getStrategyPopularity);

export default router; 