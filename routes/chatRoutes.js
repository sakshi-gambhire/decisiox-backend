import express from "express";
import { chatWithAI } from "../controllers/chatController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

console.log("chatRoutes file loaded");

// ✅ TEST ROUTE
router.get("/test", (req, res) => {
  res.send("Chat route working");
});

router.post("/", verifyToken, chatWithAI);

export default router;