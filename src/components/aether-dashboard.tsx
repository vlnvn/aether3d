"use client";

import React, { useState } from "react";
import { 
  Box, 
  Code2, 
  Cpu, 
  Layers, 
  Play, 
  Copy, 
  Sparkles, 
  Terminal,
  ChevronRight,
  ExternalLink,
  History,
  Settings
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import Preview3D from "@/components/preview-3d";
import { motion, AnimatePresence } from "framer-motion";

import { generateBlenderScript } from "@/app/actions/generate";

export default function AetherDashboard() {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState(`# Aether3D Generated Blender Script
import bpy
import random

def create_manifestation():
    # Your generated 3D geometry will appear here
    pass

if __name__ == "__main__":
    create_manifestation()`);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    
    try {
      const result = await generateBlenderScript(prompt);
      if (result.success && result.script) {
        setCode(result.script);
      } else {
        // Handle error toast
        console.error(result.error);
      }
    } catch (err) {
      console.error("Critical Aether Error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    // Add toast notification later
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-950 text-slate-200 overflow-hidden">
      {/* Top Navigation */}
      <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/50 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Box className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold tracking-tight text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Aether3D
            </span>
          </div>
          <Badge variant="outline" className="bg-blue-500/5 text-blue-400 border-blue-500/20 px-2 py-0 text-[10px] uppercase font-mono tracking-widest">
            Experimental v1.0
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                <History className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>History</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                <Settings className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="h-6 bg-slate-800 mx-2" />
          <Button variant="outline" className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white gap-2">
            <ExternalLink className="w-3 h-3" />
            Blender Guide
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar Controls (Optional, let's keep it clean for now) */}
        
        {/* Workspace Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Panel: 3D Preview */}
          <div className="flex-1 relative border-r border-slate-900 bg-slate-950 flex flex-col p-4 gap-4">
             <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                   <Layers className="w-4 h-4 text-blue-500" />
                   <h2 className="text-sm font-medium text-slate-400 uppercase tracking-widest">Aether Manifestation</h2>
                </div>
                <div className="flex items-center gap-2">
                   <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Active Scene</Badge>
                </div>
             </div>
             <div className="flex-1 min-h-0">
                <Preview3D />
             </div>
          </div>

          {/* Right Panel: Code Editor */}
          <div className="w-full md:w-[450px] lg:w-[550px] bg-slate-950 flex flex-col border-l border-slate-900">
             <div className="h-12 border-b border-slate-900 flex items-center justify-between px-4 bg-slate-900/20">
                <div className="flex items-center gap-2">
                   <Code2 className="w-4 h-4 text-indigo-500" />
                   <span className="text-xs font-mono text-slate-400">blender_generator.py</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 text-slate-400 hover:text-white hover:bg-slate-800 gap-2">
                   <Copy className="w-3.5 h-3.5" />
                   <span className="text-xs">Copy Script</span>
                </Button>
             </div>
             <div className="flex-1 bg-slate-950 pt-2">
                <Editor
                  height="100%"
                  defaultLanguage="python"
                  theme="vs-dark"
                  value={code}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    fontFamily: "var(--font-geist-mono)",
                    padding: { top: 10 },
                    backgroundColor: "#020617",
                    scrollBeyondLastLine: false,
                    readOnly: true,
                  }}
                />
             </div>
          </div>
        </div>
      </main>

      {/* Footer: Prompt Input Area */}
      <footer className="p-6 bg-slate-950 border-t border-slate-900 relative">
        <div className="max-w-4xl mx-auto relative group">
          {/* Glowing background effect for input */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur opacity-10 group-focus-within:opacity-25 transition duration-500"></div>
          
          <div className="relative bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
            <div className="flex flex-col p-1">
              <Textarea 
                placeholder="Describe your 3D manifestation (e.g. 'Generate a stylized low-poly pine tree with a twisted mahogany trunk')..."
                className="bg-transparent border-0 focus-visible:ring-0 min-h-[80px] text-lg resize-none placeholder:text-slate-600 py-4 px-6"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="flex items-center justify-between px-4 pb-3">
                <div className="flex items-center gap-4 text-slate-500">
                   <div className="flex items-center gap-1.5 cursor-help">
                      <Cpu className="w-4 h-4" />
                      <span className="text-xs font-mono">Gemini 1.5 Pro</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <Terminal className="w-4 h-4" />
                      <span className="text-xs font-mono">bpy v4.2</span>
                   </div>
                </div>
                
                <Button 
                  onClick={handleGenerate}
                  disabled={!prompt || isGenerating}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 h-10 rounded-lg gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                  {isGenerating ? (
                    <>
                      <AnimatePresence>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                      </AnimatePresence>
                      <span>Manifesting...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span className="font-semibold uppercase tracking-wider text-xs">Generate</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-4">
           <p className="text-[10px] text-slate-600 uppercase tracking-widest font-mono">
             Aether3D // Built for #JuaraVibeCoding // Indonesia 2026
           </p>
        </div>
      </footer>
    </div>
  );
}
