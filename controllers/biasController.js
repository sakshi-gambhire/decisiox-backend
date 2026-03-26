import pool from "../config/db.js";
import { generateBiasInsight } from "../services/geminiBiasService.js";

// ================= SAVE BIAS =================
export const saveBias = async (req, res) => {
  try {
    const { bias, answers } = req.body;

    console.log("✅ Controller hit:", req.body);

    // ✅ FIX: get user from JWT
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized user"
      });
    }

    const user_id = Number(req.user.id); // ✅ FIXED

    let explanation = "";
    let suggestion = "";

    // 🔥 TRY AI
    try {
      const aiResult = await generateBiasInsight(bias, answers);

      console.log("🧠 AI RESULT:", aiResult);

      if (
        aiResult &&
        aiResult.explanation &&
        aiResult.suggestion &&
        !aiResult.explanation.toLowerCase().includes("failed")
      ) {
        explanation = aiResult.explanation;
        suggestion = aiResult.suggestion;
      } else {
        throw new Error("Invalid AI response");
      }

    } catch (err) {
      console.log("⚠️ Using fallback logic");

      // 🔥 FALLBACK
      if (bias === "Loss Aversion") {
        explanation = "You tend to react emotionally to losses and may panic sell.";
        suggestion = "Focus on long-term investing and avoid emotional decisions.";
      } 
      else if (bias === "Overconfidence") {
        explanation = "You may take excessive risks after recent success.";
        suggestion = "Stick to a disciplined investment strategy.";
      } 
      else {
        explanation = "You make balanced and rational investment decisions.";
        suggestion = "Continue following a structured and consistent approach.";
      }
    }

    const query = `
      INSERT INTO bias_profiles (user_id, bias, explanation, suggestion)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [user_id, bias, explanation, suggestion];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Bias analyzed & saved ✅",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET BIAS HISTORY =================
export const getBiasHistory = async (req, res) => {
  try {
    // ✅ FIX: get user from JWT
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized user"
      });
    }

    const user_id = Number(req.user.id); // ✅ FIXED

    console.log("Fetching bias history for user:", user_id);

    const result = await pool.query(
      `SELECT * FROM bias_profiles 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [user_id]
    );

    res.status(200).json(result.rows);

  } catch (error) {
    console.error("❌ Error fetching history:", error);
    res.status(500).json({ message: "Server error" });
  }
};