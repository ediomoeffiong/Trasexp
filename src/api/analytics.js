import api from './base';

/**
 * Analytics API Service
 * Handles analytics and summary data
 */

// Helper to get userId from storage
const getUserId = () => {
    const user = localStorage.getItem('user');
    if (user) {
        try {
            return JSON.parse(user).userId;
        } catch (e) {
            console.error('Error parsing user data:', e);
            return null;
        }
    }
    return null;
};

/**
 * Get analytics summary
 * Includes category breakdown and monthly trends
 * @returns {Promise<Object>} Analytics summary data
 */
export const getAnalyticsSummary = async () => {
    const userId = getUserId();
    if (!userId) {
        throw new Error('User not authenticated');
    }

    const response = await api.get('/analytics/summary', {
        params: { userId }
    });
    return response.data;
};
