'use client';
import { Canvas } from '@react-three/fiber';
import { ARButton, XR, useXR, useXRHitTest } from '@react-three/xr';

import { useGLTF, ContactShadows, Environment } from '@react-three/drei';
import { useRef, useState, useEffect, Suspense } from 'react';

function Model({ url }) {
    const { scene } = useGLTF(url);
    const sceneClone = scene.clone();
    return <primitive object={sceneClone} />;
}

function ARSceneContent({ modelUrl }) {
    const reticleRef = useRef();
    const [modelData, setModelData] = useState(null);
    const { session } = useXR();

    useXRHitTest((hitMatrix, hit) => {
        // Only update if we have a valid hit and reticle ref
        if (hitMatrix && reticleRef.current) {
            hitMatrix.decompose(
                reticleRef.current.position,
                reticleRef.current.quaternion,
                reticleRef.current.scale
            );

            // Force reticle flat on surface
            reticleRef.current.rotation.set(-Math.PI / 2, 0, 0);
        }
    });

    useEffect(() => {
        if (!session) return;
        const onSelect = () => {
            if (reticleRef.current) {
                setModelData({
                    position: reticleRef.current.position.clone(),
                    rotation: reticleRef.current.rotation.clone(),
                });
            }
        };
        session.addEventListener('select', onSelect);
        return () => session.removeEventListener('select', onSelect);
    }, [session]);

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <Environment preset="sunset" />

            {!modelData && (
                <mesh ref={reticleRef} rotation-x={-Math.PI / 2}>
                    <ringGeometry args={[0.15, 0.2, 32]} />
                    <meshStandardMaterial color="white" opacity={0.6} transparent />
                </mesh>
            )}

            {modelData && (
                <group position={modelData.position}>
                    <Suspense fallback={null}>
                        <Model url={modelUrl} />
                    </Suspense>
                    <ContactShadows opacity={0.5} scale={10} blur={2} far={4} resolution={256} color="#000000" />
                </group>
            )}
        </>
    );
}

export default function ARViewer({ modelUrl }) {
    return (
        <div className="w-full h-screen fixed top-0 left-0 bg-black z-50">
            <ARButton
                className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/90 text-black px-6 py-3 rounded-full font-bold shadow-lg z-50"
                sessionInit={{ requiredFeatures: ['hit-test'] }}
                label="Start AR"
            />
            <Canvas>
                <XR>
                    <ARSceneContent modelUrl={modelUrl} />
                </XR>
            </Canvas>
            <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none text-white z-40 px-4">
                <p className="text-lg font-medium drop-shadow-md">Point camera at floor & tap circle to place</p>
            </div>
        </div>
    );
}
