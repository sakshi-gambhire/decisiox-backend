import { generateChatResponse } from "../services/geminiService.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    // OPTIONAL (we will improve later)
    const userProfile = req.body.userProfile || null;

    const reply = await generateChatResponse(message, userProfile);

    res.json({
      success: true,
      reply
    });

  } catch (error) {
    console.error("Chat Controller Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Chat failed"
    });
  }
};