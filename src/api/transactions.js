import api from './base';

// Transactions API
export const getAllTransactions = async (params = {}) => {
  const response = await api.get('/transactions', { params });
  return response.data;
};

export const getTransactionById = async (id) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};

export const createTransaction = async (transactionData) => {
  const response = await api.post('/transactions', transactionData);
  return response.data;
};

export const updateTransaction = async (id, transactionData) => {
  const response = await api.put(`/transactions/${id}`, transactionData);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};

// Monthly Summary API
export const getMonthlySummary = async (year, month) => {
  const response = await api.get(`/summary/monthly/${year}/${month}`);
  return response.data;
};

// Transactions by Category API
export const getTransactionsByCategory = async (category, params = {}) => {
  const response = await api.get(`/transactions/category/${category}`, { params });
  return response.data;
};