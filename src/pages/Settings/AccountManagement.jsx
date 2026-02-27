import React, { useState } from 'react';
import { useAccount } from '../../context/AccountContext';
import {
    Plus,
    Settings,
    Trash2,
    Star,
    Shield,
    ShieldOff,
    Wallet,
    CreditCard,
    Briefcase,
    CircleDollarSign,
    ChevronRight,
    AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { useSettings } from '../../hooks/useSettings';

const AccountManagement = () => {
    const { accounts, createAccount, updateAccount, deleteAccount, fetchAccounts } = useAccount();
    const { preferences } = useSettings();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        type: 'SAVINGS',
        description: '',
        pin: '',
        isDefault: false,
        pinRequired: false,
        currency: 'NGN',
        includeInOverall: true
    });

    const accountTypes = [
        { value: 'SAVINGS', label: 'Savings', icon: <Wallet size={18} /> },
        { value: 'CURRENT', label: 'Current', icon: <CreditCard size={18} /> },
        { value: 'BUSINESS', label: 'Business', icon: <Briefcase size={18} /> },
        { value: 'WALLET', label: 'Digital Wallet', icon: <CircleDollarSign size={18} /> },
        { value: 'OTHER', label: 'Other', icon: <Settings size={18} /> }
    ];

    const handleOpenCreate = () => {
        setFormData({
            name: '',
            type: 'SAVINGS',
            description: '',
            pin: '',
            isDefault: false,
            pinRequired: false,
            currency: 'NGN',
            includeInOverall: true
        });
        setShowCreateModal(true);
    };

    const handleOpenEdit = (account) => {
        setEditingAccount(account);
        setFormData({
            name: account.name,
            type: account.type,
            description: account.description || '',
            pin: '', // Don't show existing PIN
            isDefault: account.isDefault,
            pinRequired: account.pinRequired,
            currency: account.currency || 'NGN',
            includeInOverall: account.includeInOverall ?? true
        });
        setShowEditModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
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

    const handleUpdateAccount = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await updateAccount(editingAccount.id, formData);
            setShowEditModal(false);
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
                <div className="modal-overlay">
                    <div className="modal-container max-w-lg">
                        <div className="modal-header">
                            <h3>{showCreateModal ? 'Create New Account' : 'Edit Account'}</h3>
                            <button className="modal-close" onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}>&times;</button>
                        </div>
                        <form onSubmit={showCreateModal ? handleCreateAccount : handleUpdateAccount}>
                            <div className="modal-body">
                                {error && (
                                    <div className="alert alert-danger mb-4 flex items-center gap-2">
                                        <AlertCircle size={18} /> {error}
                                    </div>
                                )}

                                <div className="form-group mb-4">
                                    <label className="form-label">Account Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-input"
                                        placeholder="e.g. GTBank Savings, Personal Wallet"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="form-group">
                                        <label className="form-label">Account Type</label>
                                        <select
                                            name="type"
                                            className="form-select"
                                            value={formData.type}
                                            onChange={handleFormChange}
                                        >
                                            {accountTypes.map(t => (
                                                <option key={t.value} value={t.value}>{t.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Currency</label>
                                        <select
                                            name="currency"
                                            className="form-select"
                                            value={formData.currency}
                                            onChange={handleFormChange}
                                        >
                                            <option value="NGN">Naira (₦)</option>
                                            <option value="USD">Dollar ($)</option>
                                            <option value="EUR">Euro (€)</option>
                                            <option value="GBP">Pound (£)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group mb-4">
                                    <label className="form-label">Account PIN (Optional)</label>
                                    <input
                                        type="password"
                                        name="pin"
                                        className="form-input"
                                        placeholder="4 digits"
                                        maxLength="4"
                                        value={formData.pin}
                                        onChange={handleFormChange}
                                    />
                                </div>

                                {showEditModal && formData.currency !== editingAccount?.currency && (
                                    <div className="alert alert-info mb-4 flex items-center gap-2">
                                        <AlertCircle size={18} />
                                        <span className="text-xs">Changing currency will convert your balance and transactions using real-time rates.</span>
                                    </div>
                                )}

                                <div className="form-group mb-4">
                                    <label className="form-label">Description (Optional)</label>
                                    <textarea
                                        name="description"
                                        className="form-input"
                                        rows="2"
                                        placeholder="Short description for this account"
                                        value={formData.description}
                                        onChange={handleFormChange}
                                    ></textarea>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isDefault"
                                            checked={formData.isDefault}
                                            onChange={handleFormChange}
                                            disabled={editingAccount?.isDefault}
                                            className="w-4 h-4 rounded text-primary focus:ring-primary"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm">Set as Default Account</span>
                                            <span className="text-xs text-muted">Primary account for general transactions</span>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="pinRequired"
                                            checked={formData.pinRequired}
                                            onChange={handleFormChange}
                                            className="w-4 h-4 rounded text-primary focus:ring-primary"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm">Require PIN for Access</span>
                                            <span className="text-xs text-muted">Protect sensitive accounts with a security PIN</span>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="includeInOverall"
                                            checked={formData.includeInOverall}
                                            onChange={handleFormChange}
                                            className="w-4 h-4 rounded text-primary focus:ring-primary"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm">Include in Overall Summary</span>
                                            <span className="text-xs text-muted">Include this account's data in the aggregate dashboard view</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Processing...' : (showCreateModal ? 'Create Account' : 'Save Changes')}
                                </button>
                            </div>
                        </form>
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
        .alert-danger {
          background: var(--bg-danger-light);
          color: var(--danger-color);
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }
      `}</style>
        </div >
    );
};

export default AccountManagement;
