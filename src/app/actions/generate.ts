"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

const SYSTEM_PROMPT = `
You are a World-Class Senior Technical Artist and Expert in Blender Python Automation (bpy).
Your mission is to manifest high-quality, stylized 3D geometry from natural language intent.

--- THE MASTERCLASS DIRECTIVE ---
1. OUTPUT STRUCTURE: You must output two distinct sections:
   SECTION 1: RAW PYTHON CODE. This is your primary focus. Make it complex, detailed, and professional.
   SECTION 2: A delimiter line "---WEB_PREVIEW_JSON---" followed by a simplified JSON array of primitives for the web UI.

2. BLENDER PYTHON (bpy) EXCELLENCE:
   - Use 'clean_scene()' to start.
   - Use 'bmesh' for advanced topology manipulation.
   - GEOMETRIC LOGIC: Do not just spawn primitives. Use nested loops, procedural placement, beveled edges, and mathematical curves (sine/noise) to create high-signal, intricate models.
   - MATERIAL EXCELLENCE: Use Principled BSDF with vibrant, stylized colors and emissive glows.
   - VERSION: Target Blender 4.2+.

3. STYLIZATION & VIBE:
   The user wants a 'manifestation'. Use exaggerated proportions, cinematic lighting cues, and visual storytelling. 
   Example: 'tree' becomes a 'twisted mahogany trunk with floating golden low-poly shards'.

4. WEB PREVIEW JSON (The Proxy):
   Provide a representative set of max 15 primitives.
   Schema: [ { "type": "box"|"sphere"|"cylinder"|"cone", "position": [x,y,z], "scale": [x,y,z], "color": "#hex" } ]

--- NO PREAMBLE. NO MARKDOWN. NO EXPLANATIONS. START WITH IMPORTS. ---
`;

export async function generateBlenderScript(prompt: string) {
  if (!apiKey || apiKey === "your_api_key_here") {
    return { 
      success: false, 
      error: "Aether Core missing. Please set your GEMINI_API_KEY in .env.local." 
    };
  }

  try {
    // Upgrading to gemini-2.0-flash for superior reasoning and 3D spatial logic
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: `Manifest this intent into a Masterclass 3D asset: ${prompt}` }
    ]);
    
    const response = await result.response;
    const fullText = response.text();
    
    // Parse the delimited output
    const sections = fullText.split("---WEB_PREVIEW_JSON---");
    const pythonCode = sections[0].replace(/```python/g, "").replace(/```/g, "").trim();
    let visualData = [];
    
    if (sections[1]) {
        try {
            const jsonText = sections[1].trim();
            visualData = JSON.parse(jsonText);
        } catch (e) {
            console.warn("Aether Preview Parser Warning:", e);
        }
    }
    
    return { 
        success: true, 
        script: pythonCode,
        visualData: visualData 
    };
  } catch (error: any) {
    console.error("Aether Engine Error:", error);
    const errorMessage = error?.message?.includes("quota") 
        ? "Quota exceeded. Retrying in 60s..."
        : "Manifestation failed. Check Aether Core.";

    return { success: false, error: errorMessage };
  }
}
