import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
});

export const getProductByBarcode = async (barcode) => {
    try {
        const response = await api.get(`/products/${barcode}`);
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

export default api;
