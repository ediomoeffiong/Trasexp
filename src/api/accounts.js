import api from './base';

// Helper to get userId
const getUserId = () => {
    const user = localStorage.getItem('user');
    if (user) {
        try {
            return JSON.parse(user).userId || JSON.parse(user).id;
        } catch (e) {
            console.error('Error parsing user data:', e);
            return null;
        }
    }
    return null;
};

export const getUserAccounts = async () => {
    const userId = getUserId();
    const response = await api.get('/accounts', {
        params: { userId }
    });
    return response.data;
};

export const createAccount = async (accountData) => {
    const userId = getUserId();
    const response = await api.post('/accounts', accountData, {
        params: { userId }
    });
    return response.data;
};

export const updateAccount = async (id, accountData) => {
    const userId = getUserId();
    const response = await api.put(`/accounts/${id}`, accountData, {
        params: { userId }
    });
    return response.data;
};

export const deleteAccount = async (id) => {
    const userId = getUserId();
    const response = await api.delete(`/accounts/${id}`, {
        params: { userId }
    });
    return response.data;
};

export const verifyAccountPin = async (id, pin) => {
    const userId = getUserId();
    const response = await api.post(`/accounts/${id}/verify-pin`, { pin }, {
        params: { userId }
    });
    return response.data;
};
