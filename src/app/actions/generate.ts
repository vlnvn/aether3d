"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

const SYSTEM_PROMPT = `
You are a Senior Technical Artist and Expert in Blender Python Automation (bpy).
Your mission is to manifest high-quality, stylized 3D geometry from natural language intent.

OUTPUT FORMAT:
You must return a JSON object with two fields:
1. "blender_script": The full, professional Python script for Blender 4.2.
2. "threejs_data": A simple array of primitives for a Three.js preview.

BLENDER SCRIPT RULES:
- Include 'clean_scene()' function.
- Target Blender 4.2.
- Self-contained with all imports.

THREEJS DATA RULES:
Return an array of objects representing simple geometry:
[
  { "type": "box" | "sphere" | "cylinder" | "cone", "position": [x, y, z], "scale": [x, y, z], "color": "#hex" },
  ...
]
Limit Three.js data to max 10 primitives to represent the 'vibe' of the model.

STYLIZATION DIRECTIVE:
The user wants a 'manifestation'. Use exaggerated proportions and vibrant colors.
`;

export async function generateBlenderScript(prompt: string) {
  if (!apiKey || apiKey === "your_api_key_here") {
    return { 
      success: false, 
      error: "Aether Core missing. Please set your GEMINI_API_KEY in .env.local." 
    };
  }

  try {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest",
        generationConfig: { responseMimeType: "application/json" }
    });
    
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: `User Request: ${prompt}` }
    ]);
    
    const response = await result.response;
    const rawJson = response.text();
    const parsed = JSON.parse(rawJson);
    
    return { 
        success: true, 
        script: parsed.blender_script,
        visualData: parsed.threejs_data 
    };
  } catch (error: any) {
    console.error("Aether Engine Error:", error);
    const errorMessage = error?.message?.includes("quota") 
        ? "Quota exceeded. Please try again in a minute."
        : "Manifestation failed. Check your Aether connection.";

    return { success: false, error: errorMessage };
  }
}
