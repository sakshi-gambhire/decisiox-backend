import express from "express";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes.js";
// Load env variables FIRST
import path from "path";
import { fileURLToPath } from "url";
import biasRoutes from "./routes/biasRoutes.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.join(__dirname, ".env"),
});

// Debug env variables
console.log("=== ENV VARIABLES DEBUG ===");
console.log("PORT:", process.env.PORT);
console.log("JWT_SECRET exists:", process.env.JWT_SECRET ? "YES " : "NO ");
console.log("GEMINI_API_KEY exists:", process.env.GEMINI_API_KEY ? "YES " : "NO ❌");
console.log("===========================");

// Database connection
import "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import simulationRoutes from "./routes/simulationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";


const app = express();

// Middleware


import cors from "cors";

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://decisiox-frontend.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

app.use("/api/bias", biasRoutes);
app.use((req, res, next) => {
  console.log(`Incoming Request → ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/simulations", simulationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);


// Root route
app.get("/", (req, res) => {
  res.send("Backend Server Running");
});

// Test route for Gemini
app.get("/api/test/models", async (req, res) => {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
    );

    const data = await response.json();

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});