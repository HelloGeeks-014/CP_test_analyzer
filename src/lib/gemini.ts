import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisInput, AnalysisResult } from "../types"; // Adjusted path to reach types.ts in src/

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("VITE_GEMINI_API_KEY is not defined. AI features will fail.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export async function analyzeStressTest(input: AnalysisInput): Promise<AnalysisResult> {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const prompt = `
    Role: Competitive Programming Expert.
    Task: Find a failing test case.
    
    Problem: ${input.problemDescription}
    Correct Code: ${input.correctCode}
    Incorrect Code: ${input.incorrectCode}

    Return a JSON object:
    {
      "failingInput": "string",
      "expectedOutput": "string",
      "userOutput": "string",
      "diagnosis": "string",
      "generatorCode": "string (Python script)"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to connect to Gemini AI. Check your API key.");
  }
}