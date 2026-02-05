import api from './base';

export const getUserProfile = async () => {
    const response = await api.get('/users/me');
    return response.data;
};

export const updateProfile = async (profileData) => {
    const response = await api.put('/users/me', profileData);
    return response.data;
};

export const changePassword = async (passwordData) => {
    const response = await api.put('/users/me/password', passwordData);
    return response.data;
};

export const deactivateAccount = async (password) => {
    const response = await api.post('/users/deactivate', { password });
    return response.data;
};

export const deleteAccount = async (password) => {
    const response = await api.delete('/users/delete', {
        data: { password } // DELETE usually sends body in config.data
    });
    return response.data;
};
