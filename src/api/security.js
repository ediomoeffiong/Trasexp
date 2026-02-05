import api from './base';

export const getActiveSessions = async () => {
    const response = await api.get('/security/sessions');
    return response.data;
};

export const terminateSession = async (sessionId) => {
    const response = await api.delete(`/security/sessions/${sessionId}`);
    return response.data;
};

export const getLoginHistory = async (limit = 5) => {
    const response = await api.get(`/security/login-history?limit=${limit}`);
    return response.data;
};
