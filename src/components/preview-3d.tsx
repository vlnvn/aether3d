import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Environment } from '@react-three/drei';

interface Preview3DProps {
  // In a real app, we would pass a scene description or geometry here
  children?: React.ReactNode;
}

const Preview3D: React.FC<Preview3DProps> = ({ children }) => {
  return (
    <div className="w-full h-full min-h-[400px] bg-slate-950 rounded-lg overflow-hidden border border-slate-800 shadow-2xl relative">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="px-2 py-1 bg-blue-500/20 border border-blue-500/50 rounded text-[10px] text-blue-400 font-mono uppercase tracking-wider">
          Aether Engine v1.0
        </div>
        <div className="px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-[10px] text-slate-400 font-mono uppercase tracking-wider">
          Real-time Preview
        </div>
      </div>
      
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
          <Stage intensity={0.5} environment="city" adjustCamera={false}>
            {/* Default Placeholder: A stylized wireframe grid or sphere */}
            <mesh>
              <sphereGeometry args={[1, 32, 32]} />
              <meshStandardMaterial color="#3b82f6" wireframe />
            </mesh>
            {children}
          </Stage>
          <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-4 right-4 z-10">
         <div className="text-[10px] text-slate-500 font-mono">
            FPS: 60 | TRIS: 1.2k
         </div>
      </div>
    </div>
  );
};

export default Preview3D;
