import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔥 Retry function (NEW)
const callGemini = async (prompt) => {
  const models = ["gemini-2.5-flash", "gemini-1.5-flash"];

  for (let modelName of models) {
    try {
      console.log(`🚀 Trying model: ${modelName}`);

      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent(prompt);
      const text = await result.response.text();

      return text;

    } catch (error) {
      console.log(`❌ Model failed: ${modelName}`);
    }
  }

  throw new Error("All Gemini models failed");
};

export const generateBiasInsight = async (bias, answers) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

   const prompt = `
You are a behavioral finance expert.

User bias: ${bias}

User answers:
${JSON.stringify(answers)}

IMPORTANT:
- Return ONLY JSON
- Do NOT use markdown

Format:

{
  "explanation": "Give a detailed explanation (3-4 lines)",
  "suggestion": "Give 3-4 actionable advice points in paragraph form"
}
`;

    // 🔥 Use retry function instead of direct call
    const text = await callGemini(prompt);

    console.log("🧠 Gemini raw response:", text);

    // 🔥 Step 1: Remove markdown
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // 🔥 Step 2: Extract JSON part ONLY
    const jsonMatch = cleaned.match(/{[\s\S]*}/);

    let parsed;

    try {
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch (err) {
      console.log("⚠️ JSON parse failed, fallback used");

      return {
        explanation: cleaned,
        suggestion: "AI-generated insight"
      };
    }

    return parsed;

  } catch (error) {
    console.error("❌ Gemini Error:", error);

    // 🔥 Improved fallback (better UX)
    return {
      explanation: `You show signs of ${bias}. Your decisions may be influenced by emotional or behavioral patterns.`,
      suggestion: "Stay consistent with your strategy and avoid impulsive decisions."
    };
  }
};