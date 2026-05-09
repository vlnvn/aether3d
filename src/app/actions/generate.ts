"use server";

import { VertexAI } from "@google-cloud/vertexai";
import path from "path";

// Masterclass Config: Pointing to the Service Account key
const PROJECT_ID = "aether3d-495817";
const LOCATION = "us-central1"; 
const KEY_FILE_PATH = path.join(process.cwd(), "gcp-key.json");

// Setting environment variable for Google Cloud SDK to find the key
process.env.GOOGLE_APPLICATION_CREDENTIALS = KEY_FILE_PATH;

// Initializing Vertex AI with Masterclass Precision
const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });

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

4. WEB PREVIEW JSON (The Proxy):
   Provide a representative set of max 15 primitives.
   Schema: [ { "type": "box"|"sphere"|"cylinder"|"cone", "position": [x,y,z], "scale": [x,y,z], "color": "#hex" } ]

--- NO PREAMBLE. NO MARKDOWN. NO EXPLANATIONS. START WITH IMPORTS. ---
`;

export async function generateBlenderScript(prompt: string) {
  if (!PROJECT_ID) {
    return { 
      success: false, 
      error: "Google Cloud Project ID missing. Set GOOGLE_CLOUD_PROJECT_ID in .env.local." 
    };
  }

  try {
    // Upgrading to gemini-2.0-pro (The Master Model) via Vertex AI
    const generativeModel = vertexAI.preview.getGenerativeModel({
      model: "gemini-2.0-pro-exp-02-05", // Professional Grade Model
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    });

    const result = await generativeModel.generateContent({
      contents: [{ role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\nManifest this intent: ${prompt}` }] }],
    });

    const response = await result.response;
    const fullText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
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
    console.error("Vertex Aether Engine Error:", error);
    return { 
        success: false, 
        error: "Manifestation failed on Vertex AI. Check Cloud Console permissions." 
    };
  }
}
