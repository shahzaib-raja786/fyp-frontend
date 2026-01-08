import api from './config';

const cartService = {
    /**
     * Get user's cart
     */
    getCart: async () => {
        const response = await api.get('/cart');
        return response.data;
    },

    /**
     * Add item to cart
     */
    addToCart: async (productId, quantity, selectedOptions) => {
        const response = await api.post('/cart', {
            productId,
            quantity,
            selectedOptions
        });
        return response.data;
    },

    /**
     * Update cart item
     */
    updateCartItem: async (itemId, quantity, selectedOptions) => {
        const response = await api.put(`/cart/${itemId}`, {
            quantity,
            selectedOptions
        });
        return response.data;
    },

    /**
     * Remove item from cart
     */
    removeFromCart: async (itemId) => {
        const response = await api.delete(`/cart/${itemId}`);
        return response.data;
    },

    /**
     * Clear cart
     */
    clearCart: async () => {
        const response = await api.delete('/cart');
        return response.data;
    }
};

export default cartService;
