"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `
You are a Lead Technical Artist and expert in Blender Python (bpy). 
Your task is to convert a user's natural language description into professional, clean, and executable Blender Python code.

RULES:
1. OUTPUT ONLY RAW PYTHON CODE. Do not include markdown formatting, backticks, or conversational text.
2. Include a 'clean_scene()' function at the start to clear existing objects.
3. Use professional variable names and include comments explaining the geometric logic.
4. Ensure materials are created using Nodes (Principled BSDF).
5. The code should be self-contained and ready to paste into Blender's Scripting tab.
6. Target Blender version 4.2.

If the user request is ambiguous, interpret it in a way that creates a high-quality, stylized 3D manifestation.
`;

export async function generateBlenderScript(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: `User Request: ${prompt}` }
    ]);
    
    const response = await result.response;
    let text = response.text();
    
    // Safety: Remove markdown code blocks if the model ignores the "raw code only" instruction
    text = text.replace(/```python/g, "").replace(/```/g, "").trim();
    
    return { success: true, script: text };
  } catch (error) {
    console.error("Aether Engine Error:", error);
    return { success: false, error: "Manifestation failed. Check your Aether connection." };
  }
}
