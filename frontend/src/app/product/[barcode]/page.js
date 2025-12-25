'use client';

import { useEffect, useState } from 'react';
import { getProductByBarcode } from '@/lib/api';
import ModelViewer from '@/components/ModelViewer';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Dynamically import ARViewer to avoid SSR issues with WebXR
const ARViewer = dynamic(() => import('@/components/ARViewer'), { ssr: false });

export default function ProductPage() {
    const params = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAR, setShowAR] = useState(false);

    useEffect(() => {
        if (params.barcode) {
            getProductByBarcode(params.barcode).then((data) => {
                setProduct(data);
                setLoading(false);
            });
        }
    }, [params.barcode]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
                <Link href="/" className="text-blue-600 hover:underline">
                    &larr; Go Back to Scanner
                </Link>
            </div>
        );
    }

    // Fallback to 3D Viewer if AR is closed or not active
    return (
        <>
            {showAR ? (
                <div className="fixed inset-0 z-50 bg-black">
                    <button
                        onClick={() => setShowAR(false)}
                        className="absolute top-4 right-4 z-[60] bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/40 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <ARViewer modelUrl={product.modelUrl} />
                </div>
            ) : (
                <main className="min-h-screen bg-white pb-10">
                    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Back to Scanner
                        </Link>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                            {/* Left Column: 3D/Media */}
                            <div className="space-y-4">
                                <ModelViewer modelUrl={product.modelUrl} />
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => setShowAR(true)}
                                        className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-gray-900 transition-transform active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                                        </svg>
                                        View in AR
                                    </button>
                                </div>
                            </div>

                            {/* Right Column: Info */}
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                                    <p className="text-4xl font-light text-gray-900 mt-2">${product.price}</p>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <h3 className="text-sm font-medium text-gray-900">Description</h3>
                                    <p className="mt-2 text-gray-600 leading-relaxed">{product.description}</p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
                                    <p>Barcode: {product.barcode}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </>
    );
}
