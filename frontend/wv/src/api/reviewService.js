import api from './config';

const reviewService = {
    /**
     * Create a new review
     */
    createReview: async (reviewData) => {
        try {
            const response = await api.post('/reviews', reviewData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get reviews for a product
     */
    getProductReviews: async (productId, page = 1, limit = 10) => {
        try {
            const response = await api.get(`/reviews/product/${productId}?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get user's reviews
     */
    getUserReviews: async () => {
        try {
            const response = await api.get('/reviews/user');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update a review
     */
    updateReview: async (reviewId, reviewData) => {
        try {
            const response = await api.put(`/reviews/${reviewId}`, reviewData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete a review
     */
    deleteReview: async (reviewId) => {
        try {
            const response = await api.delete(`/reviews/${reviewId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Mark review as helpful
     */
    markHelpful: async (reviewId) => {
        try {
            const response = await api.post(`/reviews/${reviewId}/helpful`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default reviewService;
