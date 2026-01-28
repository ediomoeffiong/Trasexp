import api from './base';

// Helper to get userId (mocked or from storage)
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

// Transactions API
export const getAllTransactions = async (params = {}) => {
  const userId = getUserId();
  const response = await api.get('/transactions', {
    params: { ...params, userId }
  });
  return response.data;
};

export const getTransactionById = async (id) => {
  const userId = getUserId();
  const response = await api.get(`/transactions/${id}`, {
    params: { userId }
  });
  return response.data;
};

export const createTransaction = async (transactionData) => {
  const userId = getUserId();
  const response = await api.post('/transactions', transactionData, {
    params: { userId }
  });
  return response.data;
};

export const updateTransaction = async (id, transactionData) => {
  const userId = getUserId();
  const response = await api.put(`/transactions/${id}`, transactionData, {
    params: { userId }
  });
  return response.data;
};

export const deleteTransaction = async (id) => {
  const userId = getUserId();
  const response = await api.delete(`/transactions/${id}`, {
    params: { userId }
  });
  return response.data;
};

// Monthly Summary API
export const getMonthlySummary = async (year, month) => {
  const userId = getUserId();
  const response = await api.get('/transactions/monthly', {
    params: { year, month, userId }
  });
  return response.data;
};

// Analytics API
export const getAnalyticsSummary = async () => {
  const userId = getUserId();
  const response = await api.get('/analytics/summary', {
    params: { userId }
  });
  return response.data;
};

// Transactions by Category API
export const getTransactionsByCategory = async (category) => {
  const userId = getUserId();
  const response = await api.get('/transactions/category', {
    params: { category, userId }
  });
  return response.data;
};