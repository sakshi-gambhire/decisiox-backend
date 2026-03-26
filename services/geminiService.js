import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateInvestmentAdvice = async (data) => {
  try {

    const { age, income, savings, investmentAmount, risk, horizon } = data;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
You are a professional financial advisor.

Analyze the user's financial profile and provide advice in this structure:

Key Insight:
Explain the user's financial situation in 1-2 sentences.

Recommended Strategy:
Suggest the best investment approach.

Risk Consideration:
Explain the main financial risks.

Long Term Suggestion:
Give long-term investment guidance.


You are a professional financial advisor.

Analyze this investor profile and give SHORT advice.

Investor Profile:
Age: ${age}
Income: ${income}
Savings: ${savings}
Investment Amount: ${investmentAmount}
Risk Appetite: ${risk}
Investment Horizon: ${horizon}

Rules:
- Maximum 5 bullet points
- Each point must be 1 short sentence
- Focus only on actionable advice
- Avoid long explanations
`;
    const result = await model.generateContent(prompt);

    const response = await result.response;

    const text = response.text();

    return text;

  } catch (error) {

    console.error("Gemini Error:", error);

    throw new Error("Failed to fetch AI advice");

  }
};
export const generateChatResponse = async (message, userProfile = null) => {
  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    // 🧠 Create dynamic prompt
    let prompt = `
You are a smart financial AI assistant.

Your job:
- Answer user questions about finance, investing, money
- Keep answers simple and practical
- Be conversational like ChatGPT

`;

    // 👉 Add user financial context (VERY IMPORTANT SaaS feature)
    if (userProfile) {
      prompt += `
User Profile:
Age: ${userProfile.age}
Income: ${userProfile.income}
Savings: ${userProfile.savings}
Risk: ${userProfile.risk}
Horizon: ${userProfile.horizon}
`;
    }

    // 👉 Add user message
    prompt += `
User Question:
${message}

Rules:
- Keep answer short (3-5 lines)
- Be clear and actionable
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;

  } catch (error) {
    console.error("Chatbot Error:", error);
    throw new Error("Failed to generate chat response");
  }
};