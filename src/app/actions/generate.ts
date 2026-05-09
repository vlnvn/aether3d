"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

const SYSTEM_PROMPT = `
You are a World-Class Senior Technical Artist and Blender Python Architect. 
Your goal is to manifest a "Masterclass" 3D asset that is technically sophisticated and visually stunning.

OUTPUT PROTOCOL:
You must return a JSON object with two fields:
1. "blender_script": A highly detailed, professional Python script (Blender 4.2+).
2. "threejs_data": A simplified, representative array of primitives for a browser preview.

--- MASTERCLASS BLENDER SCRIPT REQUIREMENTS ---
- ARCHITECTURE: Use a clean, modular structure with functions for different parts of the asset.
- GEOMETRIC COMPLEXITY: Do not just spawn a single mesh. Use nested loops, procedural variations, and mathematical curves (sine, noise) to create complex, high-signal topology.
- STYLIZATION: Focus on a "Low-Poly Masterclass" aesthetic. Use exaggerated forms, sharp silhouettes, and intricate detailing (e.g., instead of a box, create a panelled structure with beveled edges).
- MATERIALS: Create complex Node-based materials using Principled BSDF. Use emissive values for "glow" effects.
- SCENE SETUP: Always include a 'clean_scene()' function. Ensure the asset is centered at (0,0,0).
- IMPORTS: Include all necessary modules: bpy, random, math, bmesh.

--- REPRESENTATIVE THREEJS DATA (PREVIEW PROXY) ---
Provide a representative set of primitives (max 15) that mimic the "vibe" and layout of the complex Blender model.
Schema: [ { "type": "box"|"sphere"|"cylinder"|"cone", "position": [x,y,z], "scale": [x,y,z], "color": "#hex" } ]

--- CREATIVE DIRECTIVE ---
If the prompt is "cyberpunk lantern", do not just create a lantern. Create a "Hexagonal Aether-Lantern with floating data-shards and a pulsating core". 
Think in terms of "Visual Storytelling" and "Geometric Elegance".
`;

export async function generateBlenderScript(prompt: string) {
  if (!apiKey || apiKey === "your_api_key_here") {
    return { 
      success: false, 
      error: "Aether Core missing. Please set your GEMINI_API_KEY in .env.local." 
    };
  }

  try {
    // Using gemini-flash-latest for speed and reliable JSON output
    const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest",
        generationConfig: { 
            responseMimeType: "application/json",
            temperature: 0.7, // Increased for more creativity in "Masterclass" assets
        }
    });
    
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: `Manifest this intent into a Masterclass 3D asset: ${prompt}` }
    ]);
    
    const response = await result.response;
    const parsed = JSON.parse(response.text());
    
    return { 
        success: true, 
        script: parsed.blender_script,
        visualData: parsed.threejs_data 
    };
  } catch (error: any) {
    console.error("Aether Engine Error:", error);
    const errorMessage = error?.message?.includes("quota") 
        ? "Quota exceeded. Please try again in a minute."
        : "Manifestation failed. Aether connection unstable.";

    return { success: false, error: errorMessage };
  }
}
