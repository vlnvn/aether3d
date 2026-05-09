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

import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetDescription
} from "@/components/ui/sheet";

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
  
  const [visualData, setVisualData] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<{prompt: string, code: string, visualData: any[], timestamp: Date}[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateBlenderScript(prompt);
      if (result.success && result.script) {
        const newManifestation = {
          prompt,
          code: result.script,
          visualData: result.visualData || [],
          timestamp: new Date()
        };
        setCode(result.script);
        setVisualData(result.visualData || []);
        setHistory(prev => [newManifestation, ...prev]);
      } else {
        setError(result.error || "Manifestation failed.");
        console.error(result.error);
      }
    } catch (err) {
      setError("Critical Aether Error. Connection lost.");
      console.error("Critical Aether Error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    // Add toast notification later
  };

  const restoreManifestation = (item: {prompt: string, code: string, visualData: any[]}) => {
    setPrompt(item.prompt);
    setCode(item.code);
    setVisualData(item.visualData);
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
          <Sheet>
            <Tooltip>
              <SheetTrigger render={<TooltipTrigger render={<Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800" />} />}>
                <History className="w-4 h-4" />
              </SheetTrigger>
              <TooltipContent>History</TooltipContent>
            </Tooltip>
            <SheetContent side="right" className="w-[400px] bg-slate-950 border-slate-800 text-slate-200 p-0 flex flex-col">
               <SheetHeader className="p-6 border-b border-slate-900">
                  <SheetTitle className="text-slate-100 flex items-center gap-2">
                     <History className="w-5 h-5 text-blue-500" />
                     Manifestation History
                  </SheetTitle>
                  <SheetDescription className="text-slate-500 text-xs">
                     Your previous Aether3D creations from this session.
                  </SheetDescription>
               </SheetHeader>
               <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                  {history.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-40 py-20 text-center px-6">
                       <Sparkles className="w-12 h-12 mb-4" />
                       <p className="text-sm font-medium">The Aether is empty.</p>
                       <p className="text-[10px] uppercase tracking-widest mt-1">Start manifesting to build your history.</p>
                    </div>
                  ) : (
                    history.map((item, index) => (
                      <button 
                        key={index} 
                        onClick={() => restoreManifestation(item)}
                        className="w-full text-left p-4 rounded-xl border border-slate-900 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 transition-all group"
                      >
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono text-blue-500 uppercase tracking-tighter">
                               {item.timestamp.toLocaleTimeString()}
                            </span>
                            <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                         </div>
                         <p className="text-sm line-clamp-2 text-slate-300 font-medium">
                            {item.prompt}
                         </p>
                      </button>
                    ))
                  )}
               </div>
            </SheetContent>
          </Sheet>
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800" />}>
              <Settings className="w-4 h-4" />
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
                <Preview3D isGenerating={isGenerating} visualData={visualData} />
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
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -top-12 left-0 right-0 flex justify-center"
              >
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 backdrop-blur-sm">
                   <Box className="w-3.5 h-3.5" />
                   {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
