import { getPlatformStats } from "../models/UserModel.js";
import pool from "../config/db.js";

import {
  getAllUsers,
  deleteUserById,
  promoteToAdmin
} from "../models/UserModel.js";
export const fetchAllUsers = async (req, res) => {

  try {

    const users = await getAllUsers();

    res.json({
      users
    });

  } catch (error) {

    console.error("Fetch Users Error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};
export const removeUser = async (req, res) => {

  try {

    const { id } = req.params;

    await deleteUserById(id);

    res.json({
      message: "User deleted successfully"
    });

  } catch (error) {

    console.error("Delete User Error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};
export const makeAdmin = async (req, res) => {

  try {

    const { id } = req.params;

    await promoteToAdmin(id);

    res.json({
      message: "User promoted to admin"
    });

  } catch (error) {

    console.error("Promote Error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};
export const getStats = async (req, res) => {

  try {

    const stats = await getPlatformStats();

    res.json(stats);

  } catch (error) {

    console.error("Stats error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};
export const getUserGrowth = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) 
      FROM users
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);

    res.json(result.rows);

  } catch (error) {

    console.error("User growth error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};
export const getRecentActivity = async (req, res) => {
  try {

    const users = await pool.query(`
      SELECT name, email, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.json(users.rows);

  } catch (error) {

    console.error("Activity error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }
};
export const saveSettings = async (req, res) => {

  try {

    const { appName, adminEmail, riskThreshold } = req.body;

    console.log("Settings received:", req.body);

    res.json({
      success: true,
      message: "Settings saved successfully"
    });

  } catch (error) {

    console.error("Settings error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
  

};
export const getRiskDistribution = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT risk_level, COUNT(*) as count
      FROM simulations
      GROUP BY risk_level
    `);

    res.json(result.rows);

  } catch (error) {

    console.error("Risk distribution error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }
};
export const getStrategyPopularity = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT strategy, COUNT(*) as count
      FROM simulations
      GROUP BY strategy
    `);

    res.json(result.rows);

  } catch (error) {

    console.error("Strategy popularity error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }
};
export const demoteAdmin = async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(
      "UPDATE users SET role = 'user' WHERE id = $1",
      [id]
    );

    res.json({
      message: "Admin demoted to user"
    });

  } catch (error) {

    console.error("Demote Error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};