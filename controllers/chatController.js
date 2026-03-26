import { generateChatResponse } from "../services/geminiService.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    // ✅ VALIDATION
    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    // OPTIONAL user profile
    const userProfile = req.body.userProfile || null;

    let reply = "";

    try {
      // ✅ CALL GEMINI
      reply = await generateChatResponse(message, userProfile);

      // ✅ SAFETY CHECK (VERY IMPORTANT)
      if (!reply || typeof reply !== "string") {
        throw new Error("Invalid AI response");
      }

    } catch (aiError) {
      console.error("Gemini Error:", aiError.message);

      // 🔥 FALLBACK RESPONSE (PREVENT 500)
      reply = "⚠️ AI is temporarily unavailable. Please try again later.";
    }

    // ✅ SUCCESS RESPONSE ALWAYS
    res.json({
      success: true,
      reply
    });

  } catch (error) {
    console.error("Chat Controller Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Chat service failed"
    });
  }
};