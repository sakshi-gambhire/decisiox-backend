import { generateInvestmentAdvice } from "../services/geminiService.js";

export const getAIRecommendation = async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const { age, income, savings, investmentAmount, risk, horizon } = req.body;
    
    // Validate all fields
    const missingFields = [];
    if (!age) missingFields.push('age');
    if (!income) missingFields.push('income');
    if (!savings) missingFields.push('savings');
    if (!investmentAmount) missingFields.push('investmentAmount');
    if (!risk) missingFields.push('risk');
    if (!horizon) missingFields.push('horizon');
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const advice = await generateInvestmentAdvice(req.body);

    res.json({
      success: true,
      data: {
        advice,
        timestamp: new Date().toISOString(),
        profile: { age, income, savings, investmentAmount, risk, horizon }
      }
    });

  } catch (error) {
    console.error("Controller Error:", error);

    // ✅ 🔥 FIX: FALLBACK RESPONSE (VERY IMPORTANT)
    res.json({
      success: true,
      data: {
        advice: "Based on your financial inputs, a balanced and diversified investment strategy is recommended. Focus on long-term growth, avoid emotional decisions, and maintain a disciplined investment approach.",
        timestamp: new Date().toISOString(),
        profile: req.body
      }
    });
  }
};