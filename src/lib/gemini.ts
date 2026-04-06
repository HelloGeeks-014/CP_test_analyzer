import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisInput, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeStressTest(input: AnalysisInput): Promise<AnalysisResult> {
  const prompt = `
    Role: You are a Competitive Programming Expert and Test Data Engineer.
    Goal: Your task is to analyze three inputs:
    1. A Problem Description (including constraints).
    2. A Correct/Reference Solution (AC code).
    3. A User’s Incorrect Solution (WA code).

    Task Workflow:
    1. Constraint Analysis: Identify the input format (e.g., T test cases, N elements, range of integers Ai).
    2. Generator Logic: Write a Python script or a logical blueprint to generate randomized, edge-case-heavy test data based on those constraints.
    3. Stress Test Execution: Conceptually run both codes against the generated data to find the smallest possible failing test case.
    4. Diagnosis: Explain why the user's code failed (e.g., integer overflow, off-by-one error, incorrect greedy logic) based on the specific failing input.

    Inputs:
    Problem Description:
    ${input.problemDescription}

    Correct Code (AC):
    ${input.correctCode}

    Incorrect Code (WA):
    ${input.incorrectCode}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          failingInput: { type: Type.STRING, description: "The exact input that causes a divergence." },
          expectedOutput: { type: Type.STRING, description: "The output from the correct code." },
          userOutput: { type: Type.STRING, description: "The output from the incorrect code." },
          diagnosis: { type: Type.STRING, description: "A concise explanation of the logic flaw in the user's code." },
          generatorCode: { type: Type.STRING, description: "A Python script to generate 10,000+ similar cases." },
        },
        required: ["failingInput", "expectedOutput", "userOutput", "diagnosis", "generatorCode"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(response.text) as AnalysisResult;
}
