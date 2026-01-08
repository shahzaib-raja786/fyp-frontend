import api from './config';

const returnService = {
    /**
     * Create a return request
     */
    createReturn: async (returnData) => {
        try {
            const response = await api.post('/returns', returnData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get user's return requests
     */
    getUserReturns: async () => {
        try {
            const response = await api.get('/returns/user');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get shop's return requests
     */
    getShopReturns: async (shopId, status = 'all') => {
        try {
            const response = await api.get(`/returns/shop/${shopId}?status=${status}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update return status
     */
    updateReturnStatus: async (returnId, status, adminNotes = '') => {
        try {
            const response = await api.put(`/returns/${returnId}/status`, { status, adminNotes });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get return by ID
     */
    getReturnById: async (returnId) => {
        try {
            const response = await api.get(`/returns/${returnId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default returnService;
