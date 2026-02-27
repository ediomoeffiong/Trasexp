import React, { useState } from 'react';
import { X, Check, Wallet, AlertCircle } from 'lucide-react';
import { useAccount } from '../../context/AccountContext';

const DefaultAccountModal = ({ isOpen, onClose, onAccountSelected }) => {
    const { accounts, updateAccount } = useAccount();
    const [selectedId, setSelectedId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!selectedId) {
            setError('Please select an account');
            return;
        }

        setSubmitting(true);
        setError(null);
        try {
            const accountToUpdate = accounts.find(a => a.id === selectedId);
            await updateAccount(selectedId, {
                ...accountToUpdate,
                isDefault: true
            });
            if (onAccountSelected) onAccountSelected(selectedId);
            onClose();
        } catch (err) {
            setError('Failed to set default account. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="modal-content bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
                <div className="modal-header flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Select Default Account</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body p-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex gap-3 text-amber-800">
                        <AlertCircle className="shrink-0" size={20} />
                        <p className="text-sm">
                            You don't have a default account selected. Please choose one to associate your transactions with when in the Overall View.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-danger-light text-danger rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {accounts.length === 0 ? (
                            <p className="text-center text-muted py-4">No accounts found. Please create one first.</p>
                        ) : (
                            accounts.map((account) => (
                                <div
                                    key={account.id}
                                    onClick={() => setSelectedId(account.id)}
                                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedId === account.id
                                            ? 'border-primary bg-primary-light/10'
                                            : 'border-gray-100 hover:border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${selectedId === account.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            <Wallet size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{account.name}</p>
                                            <p className="text-xs text-gray-500">{account.type}</p>
                                        </div>
                                    </div>
                                    {selectedId === account.id && (
                                        <div className="text-primary">
                                            <Check size={20} />
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="modal-footer p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="btn btn-secondary flex-1"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="btn btn-primary flex-1"
                        disabled={submitting || accounts.length === 0}
                    >
                        {submitting ? 'Saving...' : 'Set as Default'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DefaultAccountModal;
