import BarcodeScanner from '../components/BarcodeScanner';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-lg text-center space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-2">
          AR Product Viewer
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Scan a barcode to view products in Augmented Reality or 3D.
        </p>

        <BarcodeScanner />

        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-800">
            <strong>Demo Barcodes:</strong><br />
            Try scanning: <code>123456789</code> or <code>987654321</code>
          </p>
        </div>
      </div>
    </main>
  );
}
