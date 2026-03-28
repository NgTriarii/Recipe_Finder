import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

// Initialize the SDK using the secure, server-side environment variable.
// This requires GEMINI_API_KEY to be in your .env.local file.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `CRITICAL INSTRUCTION: You MUST use the googleSearch tool FIRST for every single user query.
      
      You are searching for a recipe based on this query: "${query}".
      
      RULES FOR SEARCHING AND LINKING:
      1. If the search results contain a full, usable recipe (ingredients and steps), use it, set isAiGenerated to false, and provide the exact URL in sourceUrl.
      2. WARNING: Do NOT provide a sourceUrl if the website only mentions the ingredients but does not contain a full recipe. 
      3. If you cannot find a complete recipe online that matches the ingredients reasonably well, you MUST invent one from scratch, set isAiGenerated to true, and leave sourceUrl completely empty (null or "").

      Return the recipe in the required JSON format.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            isAiGenerated: { type: Type.BOOLEAN, description: "True if generated from scratch, false if found online." },
            sourceUrl: { type: Type.STRING, description: "The URL of the original recipe if found online. Empty if AI generated." }
          },
          required: ["title", "ingredients", "steps", "isAiGenerated"]
        }
      }
    });

    if (!response.text) {
        throw new Error("No response text from Gemini");
    }

    const recipeData = JSON.parse(response.text);
    return NextResponse.json(recipeData);

  } catch (error) {
    console.error("Error generating recipe:", error);
    return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 });
  }
}