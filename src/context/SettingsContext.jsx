import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as settingsService from '../api/settings';
import * as userService from '../api/user';
import * as securityService from '../api/security';
import { useToast } from './ToastContext';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    // Initial state from localStorage for immediate theme application
    const [preferences, setPreferences] = useState(() => {
        const savedTheme = localStorage.getItem('trasexp-theme');
        return savedTheme ? { theme: savedTheme } : null;
    });

    const [notifications, setNotifications] = useState(null);
    const [profile, setProfile] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loginHistory, setLoginHistory] = useState([]);

    // Theme Application Logic
    const applyTheme = useCallback((theme) => {
        const root = document.documentElement;
        if (theme === 'DARK') {
            root.setAttribute('data-theme', 'dark');
        } else if (theme === 'LIGHT') {
            root.setAttribute('data-theme', 'light');
        } else {
            // SYSTEM
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.setAttribute('data-theme', isDark ? 'dark' : 'light');
        }
    }, []);

    // Watch for theme changes in preferences
    useEffect(() => {
        if (preferences?.theme) {
            applyTheme(preferences.theme);

            if (preferences.theme === 'SYSTEM') {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                const listener = (e) => {
                    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
                };
                mediaQuery.addEventListener('change', listener);
                return () => mediaQuery.removeEventListener('change', listener);
            }
        }
    }, [preferences, applyTheme]);

    const fetchProfile = useCallback(async () => {
        try {
            const data = await userService.getUserProfile();
            setProfile(data);
            return data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            showToast('Failed to load profile details', 'error');
        }
    }, [showToast]);

    const fetchNotificationPreferences = useCallback(async () => {
        try {
            const data = await settingsService.getNotificationPreferences();
            setNotifications(data);
            return data;
        } catch (error) {
            console.error('Error fetching notification settings:', error);
            showToast('Failed to load notification settings', 'error');
        }
    }, [showToast]);

    const fetchUserPreferences = useCallback(async () => {
        try {
            const data = await settingsService.getUserPreferences();
            setPreferences(data);
            if (data.theme) {
                localStorage.setItem('trasexp-theme', data.theme);
            }
            return data;
        } catch (error) {
            console.error('Error fetching user preferences:', error);
        }
    }, []);

    const fetchSecurityData = useCallback(async () => {
        try {
            const [sessionsData, historyData] = await Promise.all([
                securityService.getActiveSessions(),
                securityService.getLoginHistory()
            ]);
            setSessions(sessionsData);
            setLoginHistory(historyData);
        } catch (error) {
            console.error('Error fetching security data:', error);
            showToast('Failed to load security information', 'error');
        }
    }, [showToast]);

    const loadAllSettings = useCallback(async () => {
        setPageLoading(true);
        try {
            await Promise.allSettled([
                fetchProfile(),
                fetchNotificationPreferences(),
                fetchUserPreferences()
            ]);
        } finally {
            setPageLoading(false);
        }
    }, [fetchProfile, fetchNotificationPreferences, fetchUserPreferences]);

    const updateProfile = async (data) => {
        setLoading(true);
        try {
            const updated = await userService.updateProfile(data);
            setProfile(updated);
            showToast('Profile updated successfully', 'success');
            return updated;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to update profile', 'error');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updatePreferences = async (data) => {
        setLoading(true);
        try {
            const updated = await settingsService.updateUserPreferences(data);
            setPreferences(updated);
            if (updated.theme) {
                localStorage.setItem('trasexp-theme', updated.theme);
            }
            showToast('Preferences saved', 'success');
            return updated;
        } catch (error) {
            showToast('Failed to save preferences', 'error');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateNotifications = async (data) => {
        setLoading(true);
        try {
            const updated = await settingsService.updateNotificationPreferences(data);
            setNotifications(updated);
            showToast('Notification settings saved', 'success');
            return updated;
        } catch (error) {
            showToast('Failed to save notification settings', 'error');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (data) => {
        setLoading(true);
        try {
            await userService.changePassword(data);
            showToast('Password changed successfully', 'success');
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to change password', 'error');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const terminateSession = async (sessionId) => {
        try {
            await securityService.terminateSession(sessionId);
            setSessions(prev => prev.filter(s => s.id !== sessionId));
            showToast('Session terminated', 'success');
        } catch (error) {
            showToast('Failed to terminate session', 'error');
        }
    };

    const deactivateAccount = async (password) => {
        setLoading(true);
        try {
            await userService.deactivateAccount(password);
            showToast('Account deactivated', 'success');
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to deactivate account', 'error');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteAccount = async (password) => {
        setLoading(true);
        try {
            await userService.deleteAccount(password);
            showToast('Account deleted', 'success');
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to delete account', 'error');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        loading,
        pageLoading,
        profile,
        preferences,
        notifications,
        sessions,
        loginHistory,
        loadAllSettings,
        fetchSecurityData,
        updateProfile,
        updatePreferences,
        updateNotifications,
        changePassword,
        terminateSession,
        deactivateAccount,
        deleteAccount
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
