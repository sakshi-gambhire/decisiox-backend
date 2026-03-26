import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { 
  createUser, 
  findUserByEmail, 
  updateUserProfile,
  findUserById,
  updateUserPassword
} from "../models/UserModel.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // 🔥 EMAIL VALIDATION (BACKEND)
if (!/\S+@\S+\.\S+/.test(email)) {
  return res.status(400).json({
    message: "Invalid email format"
  });
}
    // 🔥 PASSWORD VALIDATION (BACKEND)
if (password.length < 6 || !/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
  return res.status(400).json({
    message: "Password must contain letters and numbers"
  });
}

    const existingUser = await findUserByEmail(email);

    if (existingUser) { 
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser(
      name,
      email.toLowerCase().trim(),
      hashedPassword,
      "user"
    );
    console.log("NEW USER:", newUser);
    console.log("JWT_SECRET (SIGN):", process.env.JWT_SECRET);

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: "user"
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        role: "user"
      }
    });

  } catch (error) {
    console.error("Signup Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export const login = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const password = req.body.password;

    console.log("LOGIN ATTEMPT:", email);

    const user = await findUserByEmail(email);

    console.log("USER FROM DB:", user);

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
     { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json({
      message: "Protected profile data",
      user: req.user
    });

  } catch (error) {
    console.error("Profile Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required"
      });
    }

    const updatedUser = await updateUserProfile(
      userId,
      name,
      email
    );

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Both passwords are required"
      });
    }

    const user = await findUserById(userId);

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await updateUserPassword(userId, hashedPassword);

    res.json({
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error("Change Password Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};