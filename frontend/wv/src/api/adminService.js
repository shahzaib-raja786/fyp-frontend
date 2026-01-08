import api from './config';

/**
 * Admin Service
 */
const adminService = {
    /**
     * Get dashboard stats
     */
    getStats: async () => {
        try {
            const response = await api.get('/admin/stats');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get all shops
     */
    getShops: async (params = {}) => {
        try {
            const response = await api.get('/admin/shops', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update shop status (Approve/Reject/Block)
     */
    updateShopStatus: async (shopId, statusData) => {
        try {
            const response = await api.put(`/admin/shops/${shopId}/status`, statusData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get all products
     */
    getProducts: async (params = {}) => {
        try {
            const response = await api.get('/admin/products', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update product status (Block/Unblock)
     */
    updateProductStatus: async (productId, statusData) => {
        try {
            const response = await api.put(`/admin/products/${productId}/status`, statusData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default adminService;
