import React, { useState, useEffect } from 'react';
import SummaryCard from '../components/common/SummaryCard';
import CardSkeleton from '../components/common/CardSkeleton';
import TransactionList from '../components/dashboard/TransactionList';
import Loading from '../components/common/Loading';
import { getAllTransactions } from '../api/transactions';

import { Wallet, TrendingUp, TrendingDown, Plus, List, Calendar, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { useAccount } from '../context/AccountContext';

// Custom Premium Eye Icons (Modern geometric style)
const EyeIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3.5" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <path d="M12 8v1M12 15v1M8 12h1M15 12h1" strokeWidth="1.5" opacity="0.6" />
  </svg>
);

const EyeOffIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" opacity="0.8" />
  </svg>
);

const Dashboard = () => {
  const { hideAmounts, toggleHideAmounts } = useSettings();
  const { selectedAccountId, selectedAccount } = useAccount();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getAllTransactions({ accountId: selectedAccountId });
        setTransactions(data);
        setError(null);
      } catch (err) {
        console.error("API Error:", err);
        setError('Failed to load recent transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedAccountId]);

  // Calculate totals (safe with empty array)
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = Math.abs(
    transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const netBalance = totalIncome - totalExpenses;
  const totalTransactions = transactions.length;

  const totalUnallocated = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + (t.remainingBalance || 0), 0);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear;
  });

  const monthlyCount = monthlyTransactions.length;
  const monthlyTotal = monthlyTransactions.reduce((sum, t) => {
    return t.type === 'INCOME' ? sum + t.amount : sum - Math.abs(t.amount);
  }, 0);

  const averageTransaction = totalTransactions > 0
    ? (totalIncome + totalExpenses) / totalTransactions
    : 0;

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="dashboard page-content">
      <div className="dashboard-header mb-8 flex justify-between items-end">
        <div className="header-text-group">
          <h1 className="text-2xl font-bold mb-1">Financial Overview</h1>
          <p className="text-muted">
            {error ? <span className="text-danger">Offline Mode</span> : "Welcome back! Here is your latest summary."}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleHideAmounts}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            title={hideAmounts ? "Show amounts" : "Hide amounts"}
          >
            {hideAmounts ? <EyeOffIcon size={22} /> : <EyeIcon size={22} />}
          </button>
          <Link to="/transactions" className="btn btn-primary hidden-mobile">
            <Plus size={18} className="mr-2" />
            New Transaction
          </Link>
        </div>
      </div>

      {error ? (
        <div className="error-card card mb-8 p-8 text-center border-danger">
          <div className="text-danger mb-4 mx-auto w-12 h-12 flex items-center justify-center bg-danger-light rounded-full">
            <TrendingDown size={24} />
          </div>
          <h3 className="font-bold mb-2">Connection Issues</h3>
          <p className="text-muted mb-4">{error}</p>
          <button className="btn btn-sm btn-outline-primary" onClick={() => window.location.reload()}>
            Retry Connection
          </button>
        </div>
      ) : loading ? (
        <div className="dashboard-grid mb-8">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="dashboard-grid mb-8">
          <SummaryCard
            title="Total Income"
            amount={totalIncome}
            type="income"
            icon={TrendingUp}
          />
          <SummaryCard
            title="Total Expenses"
            amount={totalExpenses}
            type="expense"
            icon={TrendingDown}
          />
          <SummaryCard
            title="Net Balance"
            amount={netBalance}
            type={netBalance >= 0 ? 'positive' : 'negative'}
            icon={Wallet}
          />
          <SummaryCard
            title="Unallocated"
            amount={totalUnallocated}
            type={totalUnallocated > 0 ? 'warning' : 'info'}
            icon={DollarSign}
            subtitle="Ready to be spent"
          />
          <SummaryCard
            title="This Month"
            amount={monthlyTotal}
            type={monthlyTotal > 0 ? 'positive' : monthlyTotal < 0 ? 'negative' : 'info'}
            icon={Calendar}
            subtitle={`${monthlyCount} transaction${monthlyCount !== 1 ? 's' : ''}`}
          />


          <SummaryCard
            title="Average Transaction"
            amount={averageTransaction}
            type="info"
            icon={Wallet}
            subtitle="Combined volume"
          />
        </div>
      )}

      {!loading && !error && transactions.length === 0 ? (
        <div className="empty-state card text-center py-12">
          <div className="bg-primary-light text-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet size={40} />
          </div>
          <h2 className="text-xl font-bold mb-2">No transactions yet</h2>
          <p className="text-muted mb-6">Add your first income or expense to see your dashboard come to life.</p>
          <Link to="/transactions" className="btn btn-primary">
            <Plus size={20} className="mr-2" />
            Add Transaction
          </Link>
        </div>
      ) : (
        <TransactionList transactions={recentTransactions} loading={loading} />
      )}
    </div>
  );
};


export default Dashboard;