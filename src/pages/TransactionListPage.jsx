import React, { useState, useEffect, useCallback } from 'react';
import { Plus, TrendingUp, TrendingDown, Inbox, X } from 'lucide-react';
import { getAllTransactions, createTransaction, updateTransaction, deleteTransaction } from '../api/transactions';
import FilterBar from '../components/transactions/FilterBar';
import TransactionList from '../components/dashboard/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';
import Loading from '../components/common/Loading';
import SummaryCard from '../components/common/SummaryCard';
import { useAccount } from '../context/AccountContext';


const TransactionListPage = () => {
    const { selectedAccountId } = useAccount();
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [filters, setFilters] = useState({
        keyword: '',
        type: 'all',
        category: 'all',
        dateFrom: '',
        dateTo: ''
    });
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Fetch transactions on mount and when account changes
    useEffect(() => {
        fetchTransactions();
    }, [selectedAccountId]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const data = await getAllTransactions({ accountId: selectedAccountId });
            setTransactions(data);
            setFilteredTransactions(data);
        } catch (err) {
            console.error('Failed to fetch transactions:', err);
            setError('Failed to load transactions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Filter transactions whenever filters change
    useEffect(() => {
        const filtered = filterTransactions(transactions, filters);
        setFilteredTransactions(filtered);
    }, [transactions, filters]);

    // Filter function
    const filterTransactions = (transactions, filters) => {
        return transactions.filter(transaction => {
            // Keyword search (case-insensitive)
            if (filters.keyword && !transaction.title?.toLowerCase().includes(filters.keyword.toLowerCase())) {
                return false;
            }

            // Type filter
            if (filters.type && filters.type !== 'all' && transaction.type !== filters.type) {
                return false;
            }

            // Category filter
            if (filters.category && filters.category !== 'all' && transaction.category !== filters.category) {
                return false;
            }

            // Date range filter
            const transactionDate = new Date(transaction.date);
            if (filters.dateFrom) {
                const fromDate = new Date(filters.dateFrom);
                fromDate.setHours(0, 0, 0, 0);
                if (transactionDate < fromDate) {
                    return false;
                }
            }
            if (filters.dateTo) {
                const toDate = new Date(filters.dateTo);
                toDate.setHours(23, 59, 59, 999);
                if (transactionDate > toDate) {
                    return false;
                }
            }

            return true;
        });
    };

    // Handle filter changes
    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
    }, []);

    // Handle add transaction
    const handleAddTransaction = async (formData) => {
        setSubmitting(true);
        setFormError(null);
        try {
            await createTransaction(formData);
            await fetchTransactions();
            setShowAddModal(false);
        } catch (err) {
            setFormError(err.response?.data || { general: 'Failed to add transaction.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateTransaction = async (formData) => {
        if (!editingTransaction) return;
        setSubmitting(true);
        setFormError(null);
        try {
            await updateTransaction(editingTransaction.id, formData);
            await fetchTransactions();
            setShowEditModal(false);
            setEditingTransaction(null);
        } catch (err) {
            setFormError(err.response?.data || { general: 'Failed to update transaction.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setShowEditModal(true);
    };

    const handleDelete = async (transactionOrId) => {
        const id = typeof transactionOrId === 'object' ? transactionOrId.id : transactionOrId;
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                setLoading(true);
                await deleteTransaction(id);
                await fetchTransactions();
            } catch (err) {
                console.error('Failed to delete transaction:', err);
                alert('Failed to delete transaction. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    // Count active filters
    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.keyword) count++;
        if (filters.type !== 'all') count++;
        if (filters.category !== 'all') count++;
        if (filters.dateFrom) count++;
        if (filters.dateTo) count++;
        return count;
    };

    // Calculate statistics
    const totalIncome = filteredTransactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = Math.abs(
        filteredTransactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + t.amount, 0)
    );

    const netBalance = totalIncome - totalExpenses;

    return (
        <div className="container page-content">
            {/* Header */}
            <div className="page-header mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Transactions</h1>
                    <p className="text-muted">
                        {error ? (
                            <span className="text-danger flex items-center gap-1">
                                <TrendingDown size={14} /> Offline Mode
                            </span>
                        ) : (
                            `${filteredTransactions.length} of ${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`
                        )}
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary hidden-mobile"
                >
                    <Plus size={18} className="mr-2" />
                    New Transaction
                </button>
            </div>

            {/* Filter Bar - Always show */}
            <FilterBar
                onFilterChange={handleFilterChange}
                activeFiltersCount={getActiveFiltersCount()}
            />

            {error ? (
                <div className="error-card card mt-8 p-12 text-center border-danger">
                    <div className="error-icon bg-danger-light text-danger mb-4 mx-auto w-16 h-16 rounded-full flex items-center justify-center">
                        <TrendingDown size={32} />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Connection Problem</h2>
                    <p className="text-muted mb-6">{error}</p>
                    <button className="btn btn-primary" onClick={() => fetchTransactions()}>
                        Retry Fetching Transactions
                    </button>
                </div>
            ) : loading ? (
                <div className="mt-8">
                    <Loading />
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    {filteredTransactions.length > 0 && (
                        <div className="dashboard-grid mb-8 mt-8">
                            <SummaryCard
                                title="Filtered Income"
                                amount={totalIncome}
                                type="income"
                                icon={TrendingUp}
                            />
                            <SummaryCard
                                title="Filtered Expenses"
                                amount={totalExpenses}
                                type="expense"
                                icon={TrendingDown}
                            />
                            <SummaryCard
                                title="Net (Filtered)"
                                amount={netBalance}
                                type={netBalance > 0 ? 'positive' : netBalance < 0 ? 'negative' : 'info'}
                                icon={TrendingUp}
                            />

                        </div>
                    )}


                    {/* Transactions List */}
                    {filteredTransactions.length === 0 && transactions.length > 0 ? (
                        <div className="empty-state card text-center py-12 mt-6">
                            <div className="bg-primary-light text-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Inbox size={40} />
                            </div>
                            <h2 className="text-xl font-bold mb-2">No transactions found</h2>
                            <p className="text-muted mb-6">
                                Try adjusting your filters to see more results.
                            </p>
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="empty-state card text-center py-12 mt-6">
                            <div className="bg-primary-light text-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Inbox size={40} />
                            </div>
                            <h2 className="text-xl font-bold mb-2">No transactions yet</h2>
                            <p className="text-muted mb-6">
                                Add your first income or expense to get started.
                            </p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="btn btn-primary"
                            >
                                <Plus size={20} className="mr-2" />
                                Add Transaction
                            </button>
                        </div>
                    ) : (
                        <div className="mt-6">
                            <TransactionList
                                transactions={filteredTransactions}
                                showAll={true}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Add Transaction Modal */}
            {showAddModal && (
                <div className="modal-overlay fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="modal-content bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="modal-header flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold">New Transaction</h2>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setFormError(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Close modal"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body p-6">
                            {formError && (
                                <div className="error-banner mb-4">
                                    {typeof formError === 'string' ? (
                                        <p>{formError}</p>
                                    ) : (
                                        Object.entries(formError).map(([field, message]) => (
                                            <p key={field}><strong>{field}:</strong> {message}</p>
                                        ))
                                    )}
                                </div>
                            )}
                            <TransactionForm
                                onSubmit={handleAddTransaction}
                                disabled={submitting}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Transaction Modal */}
            {showEditModal && (
                <div className="modal-overlay fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="modal-content bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="modal-header flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold">Edit Transaction</h2>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingTransaction(null);
                                    setFormError(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body p-6">
                            {formError && (
                                <div className="error-banner mb-4">
                                    {typeof formError === 'string' ? <p>{formError}</p> :
                                        Object.entries(formError).map(([f, m]) => <p key={f}>{m}</p>)}
                                </div>
                            )}
                            <TransactionForm
                                onSubmit={handleUpdateTransaction}
                                disabled={submitting}
                                initialData={editingTransaction}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Add Button (Mobile) */}
            <button
                onClick={() => setShowAddModal(true)}
                className="floating-add-btn btn btn-primary"
                aria-label="Add transaction"
            >
                <Plus size={24} />
            </button>
        </div>
    );
};

export default TransactionListPage;
