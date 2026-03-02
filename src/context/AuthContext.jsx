import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../api/auth';
import LoadingOverlay from '../components/common/LoadingOverlay';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [authMessage, setAuthMessage] = useState('');
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
            setIsAuthenticating(true);
            setAuthMessage('Authenticating...');
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

            // Note: We DON'T set isAuthenticating(false) here. 
            // It will be cleared when the dashboard mounts or the user navigates away.
            return { success: true };
        } catch (err) {
            const errorMessage = err.message || 'Login failed';
            setError(errorMessage);
            setIsAuthenticating(false);
            return { success: false, error: errorMessage };
        }
    };

    const register = async (userData) => {
        try {
            setIsAuthenticating(true);
            setAuthMessage('Creating your account...');
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

            // Note: We DON'T set isAuthenticating(false) here.
            return { success: true };
        } catch (err) {
            const errorMessage = err.message || 'Registration failed';
            setError(errorMessage);
            setIsAuthenticating(false);
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setError(null);
        setIsAuthenticating(false);
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
            isAuthenticating,
            setIsAuthenticating,
            error,
            clearError,
            isAuthenticated: !!user
        }}>
            {isAuthenticating && <LoadingOverlay message={authMessage} />}
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
