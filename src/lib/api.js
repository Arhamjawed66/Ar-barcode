import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
});

const MOCK_PRODUCTS = {
    "123456789": {
        "name": "Modern Chair",
        "description": "A stylish modern chair for your living room. Comfortable and durable.",
        "price": 49.99,
        "barcode": "123456789",
        "modelUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb",
        "imageUrl": "https://github.com/KhronosGroup/glTF-Sample-Models/raw/master/2.0/SheenChair/screenshot/screenshot.png"
    },
    "987654321": {
        "name": "Vintage Camera",
        "description": "A classic vintage camera model. Perfect for collectors.",
        "price": 129.50,
        "barcode": "987654321",
        "modelUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AntiqueCamera/glTF-Binary/AntiqueCamera.glb",
        "imageUrl": "https://github.com/KhronosGroup/glTF-Sample-Models/raw/master/2.0/AntiqueCamera/screenshot/screenshot.png"
    }
};

export const getProductByBarcode = async (barcode) => {
    // 1. Try to find in Mock Data first (Fastest for Demo)
    if (MOCK_PRODUCTS[barcode]) {
        console.log("Serving from Mock Data");
        return MOCK_PRODUCTS[barcode];
    }

    // 2. Try Real Backend
    try {
        const response = await api.get(`/products/${barcode}`);
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        // Fallback: ALWAYS return a demo product so the user sees something
        return {
            ...MOCK_PRODUCTS["123456789"],
            name: "Demo Product (Fallback)",
            description: "Product not found in DB. Showing demo content."
        };
    }

    // If backend returns 404/null (and catch block didn't trigger, though axios throws on 404)
    // We add a final return here just in case logic flows through
    return {
        ...MOCK_PRODUCTS["123456789"],
        name: "Demo Product (Fallback)",
        description: "Product not found. Showing demo content."
    };
};

export default api;
