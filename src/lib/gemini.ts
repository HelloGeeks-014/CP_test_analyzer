import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisInput, AnalysisResult } from "../types";

/**
 * PRO-TIP: Ensure VITE_GEMINI_API_KEY is set in your Vercel Dashboard 
 * and your local .env file. Vite will ignore variables without the VITE_ prefix.
 */
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("VITE_GEMINI_API_KEY is missing. API calls will fail until it is provided in Environment Variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export async function analyzeStressTest(input: AnalysisInput): Promise<AnalysisResult> {
  // Using gemini-1.5-flash for the best balance of speed and CP logic reasoning
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = `
    Role: You are a Competitive Programming Expert (LGM on Codeforces).
    Task: Identify the exact test case where the Incorrect Code fails compared to the Correct Code.

    Context:
    - Problem: ${input.problemDescription}
    - Language: ${input.language}
    - Correct Code (AC): ${input.correctCode}
    - User's Incorrect Code (WA): ${input.incorrectCode}

    Your output MUST be a valid JSON object with the following structure:
    {
      "failingInput": "The specific input string that causes a divergence.",
      "expectedOutput": "The output from the Correct Code.",
      "userOutput": "The output from the Incorrect Code.",
      "diagnosis": "A short explanation of the bug (e.g., 'Integer overflow in line 15', 'Wrong greedy approach').",
      "generatorCode": "A Python 3 script that generates similar edge cases for this problem."
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean any potential markdown wrapping (e.g., ```json ... ```)
    const cleanedText = text.replace(/```json|```/g, "").trim();
    
    return JSON.parse(cleanedText) as AnalysisResult;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);

    // Specific error handling for the frontend
    if (error.message?.includes("403") || error.message?.includes("API_KEY_INVALID")) {
      throw new Error("Invalid API Key. Please check your Vercel environment variables.");
    }
    
    if (error.message?.includes("429")) {
      throw new Error("Rate limit exceeded. Please wait a moment before trying again.");
    }

    throw new Error("Failed to analyze code. Please ensure your problem description and codes are clear.");
  }
}
