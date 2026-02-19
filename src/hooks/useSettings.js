import { useState, useEffect, useCallback } from 'react';
import * as settingsService from '../api/settings';
import * as userService from '../api/user';
import * as securityService from '../api/security';
import { useToast } from '../context/ToastContext';

export const useSettings = () => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    // State for different settings
    const [preferences, setPreferences] = useState(() => {
        const savedTheme = localStorage.getItem('trasexp-theme');
        return savedTheme ? { theme: savedTheme } : null;
    });
    const [notifications, setNotifications] = useState(null);
    const [profile, setProfile] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loginHistory, setLoginHistory] = useState([]);

    // Fetch User Profile
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

    // Fetch Notification Preferences
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

    // Fetch User Preferences
    const fetchUserPreferences = useCallback(async () => {
        try {
            const data = await settingsService.getUserPreferences();
            setPreferences(data);

            // Sync with localStorage
            if (data.theme) {
                localStorage.setItem('trasexp-theme', data.theme);
            }

            return data;
        } catch (error) {
            console.error('Error fetching user preferences:', error);
            // If we have a saved theme, don't clear it
        }
    }, []);

    // Fetch Security Data
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

    // Initial Data Load
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

    // Update Profile
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

    // Update Preferences
    const updatePreferences = async (data) => {
        setLoading(true);
        try {
            const updated = await settingsService.updateUserPreferences(data);
            setPreferences(updated);

            // Save theme to localStorage for immediate persistence
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

    // Update Notifications
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

    // Change Password
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

    // Terminate Session
    const terminateSession = async (sessionId) => {
        try {
            await securityService.terminateSession(sessionId);
            setSessions(prev => prev.filter(s => s.id !== sessionId));
            showToast('Session terminated', 'success');
        } catch (error) {
            showToast('Failed to terminate session', 'error');
        }
    };

    // Deactivate Account
    const deactivateAccount = async (password) => {
        setLoading(true);
        try {
            await userService.deactivateAccount(password);
            showToast('Account deactivated', 'success');
            // Logic to logout user should be handled by the component
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to deactivate account', 'error');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Delete Account
    const deleteAccount = async (password) => {
        setLoading(true);
        try {
            await userService.deleteAccount(password);
            showToast('Account deleted', 'success');
            // Logic to logout user should be handled by the component
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to delete account', 'error');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
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
};
