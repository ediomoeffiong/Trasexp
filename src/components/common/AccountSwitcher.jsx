import React, { useState } from 'react';
import { useAccount } from '../../context/AccountContext';
import { useSettings } from '../../hooks/useSettings';
import { formatCurrency } from '../../utils/currency';
import PinModal from './PinModal';

const AccountSwitcher = () => {
    const { accounts, selectedAccountId, selectedAccount, overallAccount, selectAccount, verifyPin } = useAccount();
    const { preferences } = useSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [pendingAccount, setPendingAccount] = useState(null);

    const handleAccountClick = (account) => {
        setIsOpen(false);

        // If selecting current account, do nothing
        if (account.id === selectedAccountId) return;

        // Handle PIN-protected accounts
        if (account.pinRequired) {
            setPendingAccount(account);
            setIsPinModalOpen(true);
        } else {
            selectAccount(account.id);
        }
    };

    const handlePinVerify = async (pin) => {
        if (!pendingAccount) return false;

        const isValid = await verifyPin(pendingAccount.id, pin);
        if (isValid) {
            selectAccount(pendingAccount.id);
            setPendingAccount(null);
            return true;
        }
        return false;
    };

    return (
        <div className="account-switcher-wrapper">
            <div
                className="account-switcher-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="account-info">
                    <span className="account-label">{selectedAccount?.name || 'Overall'}</span>
                    <span
                        className="account-balance"
                        style={(() => {
                            const rawBalance = selectedAccount?.balance || overallAccount?.balance || 0;
                            const currency = selectedAccount?.currency || preferences?.defaultCurrency || 'NGN';
                            const formatted = formatCurrency(rawBalance, currency);
                            const len = formatted.length;
                            if (len > 15) return { fontSize: '0.7rem' };
                            if (len > 12) return { fontSize: '0.8rem' };
                            return {};
                        })()}
                    >
                        {selectedAccount || overallAccount ?
                            formatCurrency(selectedAccount?.balance || overallAccount?.balance || 0, selectedAccount?.currency || preferences?.defaultCurrency || 'NGN') :
                            'N/A'
                        }
                    </span>
                </div>
                <svg
                    className={`chevron ${isOpen ? 'rotate' : ''}`}
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>

            {isOpen && (
                <div className="account-dropdown">
                    <div
                        className={`account-item ${selectedAccountId === null ? 'active' : ''}`}
                        onClick={() => handleAccountClick(overallAccount)}
                    >
                        <div className="account-item-info">
                            <span className="name">{overallAccount.name}</span>
                            <span className="type">Aggregate View</span>
                        </div>
                        <div
                            className="account-item-balance"
                            style={(() => {
                                const formatted = formatCurrency(overallAccount.balance || 0, preferences?.defaultCurrency || 'NGN');
                                const len = formatted.length;
                                if (len > 25) return { fontSize: '0.65rem' };
                                if (len > 20) return { fontSize: '0.75rem' };
                                if (len > 15) return { fontSize: '0.85rem' };
                                return {};
                            })()}
                        >
                            {formatCurrency(overallAccount.balance || 0, preferences?.defaultCurrency || 'NGN')}
                        </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    {accounts.map(account => (
                        <div
                            key={account.id}
                            className={`account-item ${selectedAccountId === account.id ? 'active' : ''}`}
                            onClick={() => handleAccountClick(account)}
                        >
                            <div className="account-item-info">
                                <span className="name">{account.name}</span>
                                <span className="type">{account.type}</span>
                            </div>
                            <div
                                className="account-item-balance"
                                style={(() => {
                                    const formatted = formatCurrency(account.balance || 0, account.currency || preferences?.defaultCurrency || 'NGN');
                                    const len = formatted.length;
                                    if (len > 25) return { fontSize: '0.65rem' };
                                    if (len > 20) return { fontSize: '0.75rem' };
                                    if (len > 15) return { fontSize: '0.85rem' };
                                    return {};
                                })()}
                            >
                                {formatCurrency(account.balance || 0, account.currency || preferences?.defaultCurrency || 'NGN')}
                            </div>
                            {account.pinRequired && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lock-icon" style={{ marginLeft: '8px', opacity: 0.6 }}>
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <PinModal
                isOpen={isPinModalOpen}
                onClose={() => setIsPinModalOpen(false)}
                onVerify={handlePinVerify}
                accountName={pendingAccount?.name}
            />
        </div>
    );
};

export default AccountSwitcher;
