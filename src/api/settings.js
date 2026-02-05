import api from './base';

export const getNotificationPreferences = async () => {
    const response = await api.get('/settings/notifications');
    return response.data;
};

export const updateNotificationPreferences = async (preferences) => {
    const response = await api.put('/settings/notifications', preferences);
    return response.data;
};

export const getUserPreferences = async () => {
    const response = await api.get('/settings/preferences');
    return response.data;
};

export const updateUserPreferences = async (preferences) => {
    const response = await api.put('/settings/preferences', preferences);
    return response.data;
};
