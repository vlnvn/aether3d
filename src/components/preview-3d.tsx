import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Environment, Grid } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

interface Preview3DProps {
  isGenerating?: boolean;
  children?: React.ReactNode;
}

const Preview3D: React.FC<Preview3DProps> = ({ isGenerating, children }) => {
  return (
    <div className="w-full h-full min-h-[400px] bg-slate-950 rounded-lg overflow-hidden border border-slate-800 shadow-2xl relative group">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="px-2 py-1 bg-blue-500/20 border border-blue-500/50 rounded text-[10px] text-blue-400 font-mono uppercase tracking-wider">
          Aether Engine v1.0
        </div>
        <div className="px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-[10px] text-slate-400 font-mono uppercase tracking-wider">
          Real-time Preview
        </div>
      </div>
      
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 pointer-events-none"
          >
            {/* Manifestation Scan Line */}
            <motion.div 
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            />
            {/* Subtle Overlay Glow */}
            <div className="absolute inset-0 bg-blue-500/5" />
          </motion.div>
        )}
      </AnimatePresence>

      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
          <Stage intensity={0.5} environment="city" adjustCamera={false}>
            {/* Default Placeholder: A stylized wireframe grid or sphere */}
            <mesh>
              <sphereGeometry args={[1, 32, 32]} />
              <meshStandardMaterial color={isGenerating ? "#3b82f6" : "#1e293b"} wireframe opacity={0.5} transparent />
            </mesh>
            {children}
          </Stage>
          <Grid 
            infiniteGrid 
            fadeDistance={50} 
            cellColor="#1e293b" 
            sectionColor="#3b82f6" 
            sectionThickness={1} 
            cellSize={1} 
            sectionSize={5}
            position={[0, -1.5, 0]}
          />
          <OrbitControls makeDefault autoRotate={!isGenerating} autoRotateSpeed={0.5} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-4 right-4 z-10">
         <div className="text-[10px] text-slate-500 font-mono bg-slate-950/80 px-2 py-1 rounded backdrop-blur-sm border border-slate-800">
            FPS: 60 | TRIS: 1.2k | STATUS: {isGenerating ? 'MANIFESTING...' : 'IDLE'}
         </div>
      </div>
    </div>
  );
};

export default Preview3D;
