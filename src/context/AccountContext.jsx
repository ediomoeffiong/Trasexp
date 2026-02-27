import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserAccounts, verifyAccountPin, createAccount as apiCreateAccount, updateAccount as apiUpdateAccount, deleteAccount as apiDeleteAccount } from '../api/accounts';
import { useAuth } from './AuthContext';

const AccountContext = createContext();

export const useAccount = () => useContext(AccountContext);

export const AccountProvider = ({ children }) => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccountId, setSelectedAccountId] = useState(() => {
        // Restore from localStorage if available
        return localStorage.getItem('selectedAccountId') || null;
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const overallAccount = {
        id: null,
        name: 'Overall Account',
        type: 'OVERALL',
        isDefault: false,
        balance: accounts.filter(acc => acc.includeInOverall !== false).reduce((sum, acc) => sum + (acc.balance || 0), 0),
        isOverall: true
    };

    const fetchAccounts = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await getUserAccounts();
            setAccounts(data);

            // If no account is selected, or selected account is not in the list, 
            // check if it's the Overall Account (null). If not, default to the first one or null.
            if (selectedAccountId && selectedAccountId !== 'null' && !data.find(a => a.id.toString() === selectedAccountId.toString())) {
                setSelectedAccountId(null);
                localStorage.removeItem('selectedAccountId');
            }
        } catch (err) {
            console.error('Failed to fetch accounts:', err);
            setError('Failed to load accounts');
        } finally {
            setLoading(false);
        }
    }, [user, selectedAccountId]);

    useEffect(() => {
        if (user) {
            fetchAccounts();
        } else {
            setAccounts([]);
            setSelectedAccountId(null);
            localStorage.removeItem('selectedAccountId');
        }
    }, [user]);

    const selectAccount = (id) => {
        setSelectedAccountId(id);
        if (id === null) {
            localStorage.removeItem('selectedAccountId');
        } else {
            localStorage.setItem('selectedAccountId', id);
        }
    };

    const createAccount = async (accountData) => {
        try {
            const newAccount = await apiCreateAccount(accountData);
            await fetchAccounts();
            return newAccount;
        } catch (err) {
            console.error('Failed to create account:', err);
            throw err;
        }
    };

    const updateAccount = async (id, accountData) => {
        try {
            const updatedAccount = await apiUpdateAccount(id, accountData);
            await fetchAccounts();
            return updatedAccount;
        } catch (err) {
            console.error('Failed to update account:', err);
            throw err;
        }
    };

    const deleteAccount = async (id) => {
        try {
            await apiDeleteAccount(id);
            if (selectedAccountId?.toString() === id.toString()) {
                setSelectedAccountId(null);
                localStorage.removeItem('selectedAccountId');
            }
            await fetchAccounts();
        } catch (err) {
            console.error('Failed to delete account:', err);
            throw err;
        }
    };

    const verifyPin = async (accountId, pin) => {
        try {
            const isValid = await verifyAccountPin(accountId, pin);
            return isValid;
        } catch (err) {
            console.error('PIN verification failed:', err);
            return false;
        }
    };

    const selectedAccount = selectedAccountId === null || selectedAccountId === 'null'
        ? overallAccount
        : accounts.find(a => a.id.toString() === selectedAccountId.toString());

    return (
        <AccountContext.Provider value={{
            accounts,
            selectedAccountId,
            selectedAccount,
            overallAccount,
            loading,
            error,
            fetchAccounts,
            selectAccount,
            createAccount,
            updateAccount,
            deleteAccount,
            verifyPin
        }}>
            {children}
        </AccountContext.Provider>
    );
};
