"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

const SYSTEM_PROMPT = `
You are a Senior Technical Artist and Expert in Blender Python Automation (bpy).
Your mission is to manifest high-quality, stylized 3D geometry from natural language intent.

ENGINEERING CONSTRAINTS:
1. OUTPUT RAW PYTHON CODE ONLY. No markdown, no backticks, no preamble, no apologies.
2. UNIVERSAL CLEANUP: Always start with a 'clean_scene()' function that deletes all objects, meshes, and materials to ensure a fresh manifestation.
3. VERSION TARGET: Blender 4.2+ (use modern bpy API).
4. MATERIAL EXCELLENCE: Use the Principled BSDF node for all materials. Ensure colors are vibrant and stylized (low-poly/artistic).
5. GEOMETRIC LOGIC: 
   - Favor primitives (IcoSpheres, Cylinders) with low subdivisions for the 'stylized' look.
   - Use procedural placement (randomness) for organic elements like leaves or debris.
   - Ensure the final asset is centered at (0,0,0).
6. SELF-CONTAINED: The script must include all imports (bpy, random, math, etc.) and execute the main function at the end.

STYLIZATION DIRECTIVE:
The user wants a 'manifestation'—not just a 3D model. Use exaggerated proportions, vibrant lighting suggestions in materials, and clean topology. If the prompt is simple, expand on the geometric detail (e.g., 'tree' becomes a 'twisted mahogany trunk with golden low-poly leaves').
`;

export async function generateBlenderScript(prompt: string) {
  if (!apiKey || apiKey === "your_api_key_here") {
    console.error("Aether Engine Error: API Key is missing or using placeholder.");
    return { 
      success: false, 
      error: "Aether Core missing. Please set your GEMINI_API_KEY in .env.local." 
    };
  }

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
  } catch (error: any) {
    console.error("Aether Engine Error:", error);
    
    // Provide more specific error messages if possible
    const errorMessage = error?.message?.includes("API_KEY_INVALID") 
      ? "Invalid Aether Key. Please check your Gemini API Key."
      : "Manifestation failed. Check your Aether connection or quota.";

    return { success: false, error: errorMessage };
  }
}
