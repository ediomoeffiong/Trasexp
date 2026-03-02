import React, { useState } from 'react';
import {
    Wallet,
    CreditCard,
    Briefcase,
    CircleDollarSign,
    Settings,
    AlertCircle
} from 'lucide-react';

const AccountForm = ({ onSubmit, onCancel, initialData, loading, error }) => {
    const [formData, setFormData] = useState(initialData || {
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

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="account-form">
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
                    autoComplete="new-password"
                />
            </div>

            {initialData && formData.currency !== initialData.currency && (
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

            <div className="flex flex-col gap-3 mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleFormChange}
                        disabled={initialData?.isDefault}
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

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Processing...' : (initialData ? 'Save Changes' : 'Create Account')}
                </button>
            </div>
        </form>
    );
};

export default AccountForm;
