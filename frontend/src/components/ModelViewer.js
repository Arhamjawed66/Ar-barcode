'use client';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';

function Model({ url }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
}

export default function ModelViewer({ modelUrl }) {
    return (
        <div className="w-full h-[500px] bg-gray-50 rounded-xl overflow-hidden shadow-inner relative border border-gray-200">
            <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
                <Suspense fallback={null}>
                    <Stage environment="city" intensity={0.6} contactShadow={false}>
                        <Model url={modelUrl} />
                    </Stage>
                </Suspense>
                <OrbitControls autoRotate makeDefault />
            </Canvas>
            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                <span className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                    3D View • Drag to rotate
                </span>
            </div>
        </div>
    );
}
