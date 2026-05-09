"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. STABLE CONFIGURATION
const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const SYSTEM_PROMPT = `
You are a World-Class Senior Technical Artist and Expert in Blender Python Automation (bpy).
Your mission is to manifest high-quality, stylized 3D geometry from natural language intent.

--- THE MASTERCLASS DIRECTIVE ---
1. OUTPUT STRUCTURE: You must output two distinct sections:
   SECTION 1: RAW PYTHON CODE. Detailed, professional, complex bpy logic using 'bmesh', nested loops, and node materials.
   SECTION 2: A delimiter line "---WEB_PREVIEW_JSON---" followed by a simplified JSON array for Three.js.

2. BLENDER PYTHON (bpy) EXCELLENCE:
   - Use 'clean_scene()', 'bmesh', Principed BSDF, and modern bpy API (4.2+).
   - Ensure the asset is centered at (0,0,0).

3. WEB PREVIEW JSON Schema: [ { "type": "box"|"sphere"|"cylinder"|"cone", "position": [x,y,z], "scale": [x,y,z], "color": "#hex" } ]

--- NO PREAMBLE. NO MARKDOWN. NO EXPLANATIONS. START WITH IMPORTS. ---
`;

export async function generateBlenderScript(prompt: string) {
  if (!API_KEY || API_KEY === "your_api_key_here") {
    return { success: false, error: "Aether Key missing. Please set your API Key." };
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Identified as ACTIVE and SUPPORTED for this project key in 2026
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: {
            maxOutputTokens: 4096,
            temperature: 0.8,
        }
    });

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
            visualData = JSON.parse(sections[1].trim());
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
    console.error("Aether Core Error:", error);
    let msg = "Manifestation failed. ";
    if (error.message?.includes("429")) msg += "Aether overloaded. Wait 60s.";
    else if (error.message?.includes("404")) msg += "Engine Mismatch. Try gemini-pro-latest.";
    else msg += error.message || "Check Aether connection.";

    return { success: false, error: msg };
  }
}
