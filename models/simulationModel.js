import pool from "../config/db.js";

export const createSimulation = async (
  user_id, // 🔥 ADD THIS
  age,
  income,
  savings,
  investment_amount,
  risk_level,
  investment_horizon,
  investment_goal,
  strategy
) => {
  const result = await pool.query(
    `INSERT INTO simulations 
     (user_id, age, income, savings, investment_amount, risk_level, investment_horizon, investment_goal, strategy)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      user_id, // 🔥 FIRST PARAM
      age,
      income,
      savings,
      investment_amount,
      risk_level,
      investment_horizon,
      investment_goal,
      strategy
    ]
  );

  return result.rows[0];
};


export const getSimulationsByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM simulations 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [Number(user_id)] // ✅ ensure integer
  );

  return result.rows;
};