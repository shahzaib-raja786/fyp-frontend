import api from './config';

/**
 * Order Service
 */
const orderService = {
    /**
     * Create new order
     */
    createOrder: async (orderData) => {
        try {
            const response = await api.post('/orders', orderData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get user's orders
     */
    getUserOrders: async () => {
        try {
            const response = await api.get('/orders');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get shop orders (for shop owners)
     */
    getShopOrders: async (shopId) => {
        try {
            const response = await api.get(`/orders/shop/${shopId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get single order details
     */
    getOrder: async (orderId) => {
        try {
            const response = await api.get(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update order status (shop owner only)
     */
    updateOrderStatus: async (orderId, status) => {
        try {
            const response = await api.put(`/orders/${orderId}/status`, { status });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get shop orders with filters
     */
    getShopOrders: async (shopId, filters = {}) => {
        try {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.limit) params.append('limit', filters.limit.toString());

            const queryString = params.toString();
            const url = `/orders/shop/${shopId}${queryString ? `?${queryString}` : ''}`;

            const response = await api.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get single order by ID
     */
    getOrderById: async (orderId) => {
        try {
            const response = await api.get(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default orderService;
