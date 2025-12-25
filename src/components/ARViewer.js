'use client';
import { Canvas } from '@react-three/fiber';
import { XR, createXRStore, useXRHitTest } from '@react-three/xr';
import { useGLTF, ContactShadows, Environment } from '@react-three/drei';
import { useRef, useState, Suspense } from 'react';

// Create the store outside the component to persist state
const store = createXRStore({
    features: ['hit-test'],
    depthSensing: false,
});

function Model({ url }) {
    const { scene } = useGLTF(url);
    const sceneClone = scene.clone();
    return <primitive object={sceneClone} />;
}

function ARSceneContent({ modelUrl }) {
    const reticleRef = useRef();
    const [modelData, setModelData] = useState(null);

    useXRHitTest((hitMatrix, hit) => {
        // Safe check for reticle
        if (hitMatrix && reticleRef.current) {
            hitMatrix.decompose(
                reticleRef.current.position,
                reticleRef.current.quaternion,
                reticleRef.current.scale
            );

            // Look straight up/flat
            reticleRef.current.rotation.set(-Math.PI / 2, 0, 0);
        }
    });

    const placeModel = () => {
        if (reticleRef.current && !modelData) {
            setModelData({
                position: reticleRef.current.position.clone(),
                rotation: reticleRef.current.rotation.clone(),
            });
        }
    };

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <Environment preset="sunset" />

            {/* Reticle - Clickable to Place */}
            {!modelData && (
                <mesh
                    ref={reticleRef}
                    rotation-x={-Math.PI / 2}
                    onClick={placeModel} // Initial desktop/touch test
                >
                    <ringGeometry args={[0.15, 0.2, 32]} />
                    <meshStandardMaterial color="white" opacity={0.8} />
                </mesh>
            )}

            {/* Invisible large plane for tapping anywhere if needed, 
                but reticle tap is safer for starters. 
                Actually, standard AR behavior is "Tap Screen" not "Tap Reticle". 
                Let's use a pointer event on the main group or useXR input source event. 
                But for stability now, let's keep it simple: If reticle is visible, 
                add an event listener to the window/canvas? 
                Actually, @react-three/xr handles interaction. 
                Let's use a global onClick on the scene if possible?
                
                Simpler: Helper mesh for tapping.
            */}
            <group onClick={placeModel}>
                {!modelData && <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} visible={false}>
                    <planeGeometry args={[100, 100]} />
                </mesh>}
            </group>

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
            {/* Custom Start Button */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
                <button
                    onClick={() => store.enterAR()}
                    className="bg-white/90 text-black px-8 py-3 rounded-full font-bold shadow-lg active:scale-95 transition-transform"
                >
                    Start AR
                </button>
            </div>

            <Canvas>
                <XR store={store}>
                    <ARSceneContent modelUrl={modelUrl} />
                </XR>
            </Canvas>

            <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none text-white z-40 px-4">
                <p className="text-lg font-medium drop-shadow-md">Point camera at floor & tap screen to place</p>
            </div>
        </div>
    );
}
