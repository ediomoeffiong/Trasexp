import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check localStorage for persisted user
        const storedUser = authService.getCurrentUser();
        const token = localStorage.getItem('authToken');

        if (storedUser && token) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            setLoading(true);
            setError(null);

            // Call login API
            const response = await authService.login(credentials);

            // Save auth data
            authService.saveAuthData(response);

            // Update user state
            const userInfo = {
                userId: response.userId,
                email: response.email,
                username: response.username,
            };
            setUser(userInfo);

            return { success: true };
        } catch (err) {
            const errorMessage = err.message || 'Login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            setError(null);

            // Call register API
            const response = await authService.register(userData);

            // Save auth data
            authService.saveAuthData(response);

            // Update user state
            const userInfo = {
                userId: response.userId,
                email: response.email,
                username: response.username,
            };
            setUser(userInfo);

            return { success: true };
        } catch (err) {
            const errorMessage = err.message || 'Registration failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setError(null);
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            loading,
            error,
            clearError,
            isAuthenticated: !!user
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
