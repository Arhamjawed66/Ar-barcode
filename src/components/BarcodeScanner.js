'use client';
import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useRouter } from 'next/navigation';

const BarcodeScanner = () => {
    const router = useRouter();
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Scanner configuration needs DOM element "reader"
        // We wrap initialization in a timeout or check if element exists
        const onScanSuccess = (decodedText, decodedResult) => {
            // Handle success
            scanner.clear().then(() => {
                setScanResult(decodedText);
                router.push(`/product/${decodedText}`);
            }).catch(err => console.error("Failed to clear", err));
        };

        const onScanFailure = (err) => {
            // console.warn(err);
        };

        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            },
      /* verbose= */ false
        );

        scanner.render(onScanSuccess, onScanFailure);

        return () => {
            scanner.clear().catch(err => {
                // console.error("Failed to clear scanner on unmount", err)
            });
        };
    }, [router]);

    return (
        <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Scan Product Barcode</h2>
            <div id="reader" className="w-full overflow-hidden rounded-md bg-gray-200 min-h-[300px]"></div>
            {scanResult && (
                <p className="text-center mt-4 text-green-600 font-semibold">
                    Found: {scanResult}. Redirecting...
                </p>
            )}
            {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
    );
};

export default BarcodeScanner;
