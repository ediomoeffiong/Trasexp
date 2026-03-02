import React, { useState } from 'react';
import { useAccount } from '../../context/AccountContext';
import {
    Plus,
    Settings,
    Trash2,
    Star,
    Shield,
    Wallet,
    CreditCard,
    Briefcase,
    CircleDollarSign,
    X
} from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { useSettings } from '../../hooks/useSettings';
import AccountForm from '../../components/accounts/AccountForm';

const AccountManagement = () => {
    const { accounts, createAccount, updateAccount, deleteAccount } = useAccount();
    const { preferences } = useSettings();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const accountTypes = [
        { value: 'SAVINGS', label: 'Savings', icon: <Wallet size={18} /> },
        { value: 'CURRENT', label: 'Current', icon: <CreditCard size={18} /> },
        { value: 'BUSINESS', label: 'Business', icon: <Briefcase size={18} /> },
        { value: 'WALLET', label: 'Digital Wallet', icon: <CircleDollarSign size={18} /> },
        { value: 'OTHER', label: 'Other', icon: <Settings size={18} /> }
    ];

    const handleOpenCreate = () => {
        setError(null);
        setShowCreateModal(true);
    };

    const handleOpenEdit = (account) => {
        setError(null);
        setEditingAccount(account);
        setShowEditModal(true);
    };

    const handleCreateAccount = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            await createAccount(formData);
            setShowCreateModal(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAccount = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            await updateAccount(editingAccount.id, formData);
            setShowEditModal(false);
            setEditingAccount(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update account');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async (id) => {
        if (window.confirm('Are you sure you want to delete this account? All associated transactions will be inaccessible.')) {
            setLoading(true);
            try {
                await deleteAccount(id);
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete account');
            } finally {
                setLoading(false);
            }
        }
    };

    const getAccountIcon = (type) => {
        const found = accountTypes.find(t => t.value === type);
        return found ? found.icon : <Wallet size={18} />;
    };

    return (
        <div className="account-management">
            <div className="settings-header flex justify-between items-start mb-6">
                <div>
                    <h2>Financial Accounts</h2>
                    <p>Manage your multiple bank accounts and wallets</p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={handleOpenCreate}>
                    <Plus size={18} className="mr-2" />
                    Add Account
                </button>
            </div>

            <div className="accounts-list grid gap-4">
                {accounts.map(account => (
                    <div key={account.id} className="card account-mgmt-card hover-effect">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="account-type-icon bg-primary-light text-primary p-3 rounded-xl">
                                    {getAccountIcon(account.type)}
                                </div>
                                <div className="account-details">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-lg">{account.name}</h4>
                                        {account.isDefault && (
                                            <span className="badge badge-primary flex items-center gap-1 text-[10px] py-0.5">
                                                <Star size={10} fill="currentColor" /> Default
                                            </span>
                                        )}
                                        {account.pinRequired && (
                                            <Shield size={14} className="text-warning" title="PIN Protected" />
                                        )}
                                    </div>
                                    <p className="text-muted text-sm">{account.type} • {account.description || 'No description'}</p>
                                </div>
                            </div>
                            <div className="account-actions-right text-right">
                                <div className="text-xl font-bold mb-2">
                                    {formatCurrency(account.balance, account.currency || 'NGN')}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        className="p-2 text-muted hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
                                        onClick={() => handleOpenEdit(account)}
                                        title="Edit Account"
                                    >
                                        <Settings size={18} />
                                    </button>
                                    {!account.isDefault && (
                                        <button
                                            className="p-2 text-muted hover:text-danger hover:bg-danger-light rounded-lg transition-colors"
                                            onClick={() => handleDeleteAccount(account.id)}
                                            title="Delete Account"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {accounts.length === 0 && (
                    <div className="empty-accounts text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <div className="mb-4 text-gray-300 flex justify-center">
                            <Wallet size={48} />
                        </div>
                        <h3 className="text-lg font-bold">No accounts found</h3>
                        <p className="text-muted mb-6">Create your first account to start tracking transactions.</p>
                        <button className="btn btn-primary" onClick={handleOpenCreate}>
                            Create Primary Account
                        </button>
                    </div>
                )}
            </div>

            {/* Account Modal (Create/Edit) */}
            {(showCreateModal || showEditModal) && (
                <div className="modal-overlay fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => { setShowCreateModal(false); setShowEditModal(false); setEditingAccount(null); }}>
                    <div className="modal-container max-w-lg" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{showCreateModal ? 'Create New Account' : 'Edit Account'}</h3>
                            <button className="text-gray-400 hover:text-gray-600" onClick={() => { setShowCreateModal(false); setShowEditModal(false); setEditingAccount(null); }}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body p-6">
                            <AccountForm
                                onSubmit={showCreateModal ? handleCreateAccount : handleUpdateAccount}
                                onCancel={() => { setShowCreateModal(false); setShowEditModal(false); setEditingAccount(null); }}
                                initialData={editingAccount}
                                loading={loading}
                                error={error}
                            />
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .account-mgmt-card {
           padding: 1.5rem;
           border-radius: 1rem;
           margin-bottom: 1rem;
        }
        .badge-primary {
          background: var(--bg-primary-light);
          color: var(--primary-color);
          padding: 2px 8px;
          border-radius: 99px;
          font-weight: 600;
        }
      `}</style>
        </div>
    );
};

export default AccountManagement;
