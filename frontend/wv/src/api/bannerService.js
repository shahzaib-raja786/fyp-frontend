import axios from 'axios';
import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const getAuthHeader = async () => {
    const token = await AsyncStorage.getItem('authToken');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        }
    };
};

// Helper: Append Image to FormData
const appendImage = async (formData, key, uri, name) => {
    if (!uri) return;

    if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append(key, blob, name);
    } else {
        formData.append(key, {
            uri,
            type: 'image/jpeg',
            name,
        });
    }
};

const bannerService = {
    // Public: Get active banners
    getBanners: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/banners`);
            return response.data;
        } catch (error) {
            console.error('Error fetching banners:', error);
            throw error;
        }
    },

    // Admin: Get all banners (including inactive)
    getAllBannersAdmin: async () => {
        const token = await AsyncStorage.getItem('authToken');
        // Standard JSON header for get
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_BASE_URL}/banners/admin`, config);
        return response.data;
    },

    createBanner: async (bannerData, imageUri) => {
        const config = await getAuthHeader();
        const formData = new FormData();

        // Append fields
        Object.keys(bannerData).forEach(key => {
            formData.append(key, bannerData[key]);
        });

        // Append Image
        if (imageUri) {
            await appendImage(formData, 'image', imageUri, 'banner.jpg');
        }

        const response = await axios.post(`${API_BASE_URL}/banners`, formData, config);
        return response.data;
    },

    updateBanner: async (id, bannerData, imageUri) => {
        const config = await getAuthHeader();
        const formData = new FormData();

        // Append fields
        Object.keys(bannerData).forEach(key => {
            formData.append(key, bannerData[key]);
        });

        // Append Image (only if new URI provided)
        if (imageUri && !imageUri.startsWith('http')) {
            await appendImage(formData, 'image', imageUri, 'banner.jpg');
        }

        const response = await axios.put(`${API_BASE_URL}/banners/${id}`, formData, config);
        return response.data;
    },

    deleteBanner: async (id) => {
        // Delete uses standard JSON auth header, not multipart
        const token = await AsyncStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.delete(`${API_BASE_URL}/banners/${id}`, config);
        return response.data;
    }
};

export default bannerService;
