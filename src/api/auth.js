import api from './base';

/**
 * Authentication API Service
 * Handles user registration, login, and logout
 */

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.username - User's username
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} Auth response with token and user info
 */
export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} Auth response with token and user info
 */
export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

/**
 * Logout user (client-side)
 * Clears authentication token and user data from localStorage
 */
export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
};

/**
 * Get current user from localStorage
 * @returns {Object|null} User object or null if not logged in
 */
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (e) {
            console.error('Error parsing user data:', e);
            return null;
        }
    }
    return null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token
 */
export const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    const user = getCurrentUser();
    return !!(token && user);
};

/**
 * Save authentication data to localStorage
 * @param {Object} authData - Authentication response data
 * @param {string} authData.token - JWT token
 * @param {Object} authData.user - User information
 */
export const saveAuthData = (authData) => {
    if (authData.token) {
        localStorage.setItem('authToken', authData.token);
    }

    // Store user info (without password)
    const userInfo = {
        userId: authData.userId,
        email: authData.email,
        username: authData.username,
    };
    localStorage.setItem('user', JSON.stringify(userInfo));
};
