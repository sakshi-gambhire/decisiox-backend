import { createSimulation, getSimulationsByUser } from "../models/simulationModel.js";
import pool from "../config/db.js";

// ================= SAVE SIMULATION =================
export const saveSimulation = async (req, res) => {
  try {
    const {
      age,
      income,
      savings,
      investment_amount,
      risk_level,
      investment_horizon,
      investment_goal,
      strategy
    } = req.body;

    // ✅ AUTH CHECK
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user"
      });
    }

    const user_id = Number(req.user.id); // ✅ FORCE INTEGER

    // ✅ DEBUG
    console.log("Saving simulation for user:", user_id);

    const simulation = await createSimulation(
      user_id,
      age,
      income,
      savings,
      investment_amount,
      risk_level,
      investment_horizon,
      investment_goal,
      strategy
    );

    res.status(201).json({
      success: true,
      message: "Simulation saved successfully",
      simulation
    });

  } catch (error) {
    console.error("=== SAVE SIMULATION ERROR ===");
    console.error(error);
    console.error("============================");

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= GET USER SIMULATIONS =================
export const getUserSimulations = async (req, res) => {
  try {
    // ✅ AUTH CHECK
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user"
      });
    }

    const user_id = Number(req.user.id); // ✅ FORCE INTEGER

    console.log("Fetching simulations for user:", user_id);

    // 🔥 IMPORTANT: ENSURE FILTERING HAPPENS
    const simulations = await getSimulationsByUser(user_id);

    res.status(200).json({
      success: true,
      simulations
    });

  } catch (error) {
    console.error("Fetch Simulation Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= RISK ANALYTICS =================
export const getRiskAnalytics = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user"
      });
    }

    const user_id = Number(req.user.id); // ✅ FORCE INTEGER

    console.log("Fetching analytics for user:", user_id);

    const query = `
      SELECT risk_level, COUNT(*) 
      FROM simulations
      WHERE user_id = $1
      GROUP BY risk_level
    `;

    const result = await pool.query(query, [user_id]);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    console.log("LOGGED IN USER:", req.user);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};