import express from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword
} from "../controllers/authController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

// 🔥 IMPORT THESE (VERY IMPORTANT)
import {
  findUserByEmail,
  createUser
} from "../models/UserModel.js";

const router = express.Router();

// 🔥 USE YOUR REAL CLIENT ID
const CLIENT_ID =
  "498968811146-mir587bc82pfb4g0076c74q5abn4vt4m.apps.googleusercontent.com";

const client = new OAuth2Client(CLIENT_ID);

// ================= GOOGLE LOGIN =================
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    // 🔐 Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // 🔥 CLEAN EMAIL
    const email = payload.email.toLowerCase().trim();

    // 🔍 CHECK IF USER EXISTS
    let user = await findUserByEmail(email);

    // 🆕 CREATE USER IF NOT EXISTS
    if (!user) {
      user = await createUser(
        payload.name,
        email,
        "", // no password for Google users
        "user"
      );
    }

    // 🔐 CREATE JWT WITH REAL USER ID
    const token = jwt.sign(
      {
        id: user.id,        // ✅ VERY IMPORTANT
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ RESPONSE
    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("GOOGLE AUTH ERROR:", error);

    res.status(500).json({
      message: "Google authentication failed",
    });
  }
});

// ================= NORMAL AUTH =================
router.post("/signup", signup);
router.post("/login", login);

// ================= PROTECTED =================
router.put("/change-password", verifyToken, changePassword);
router.get("/profile", verifyToken, getProfile);
router.put("/update-profile", verifyToken, updateProfile);

export default router;