import React, { useState, useEffect } from 'react';
import SummaryCard from '../components/common/SummaryCard';
import CardSkeleton from '../components/common/CardSkeleton';
import TransactionList from '../components/dashboard/TransactionList';
import Loading from '../components/common/Loading';
import { getAllTransactions } from '../api/transactions';

import { Wallet, TrendingUp, TrendingDown, Plus, List, Calendar, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getAllTransactions();
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
  }, []);

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
    <div className="dashboard container page-content">
      <div className="dashboard-header mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1">Financial Overview</h1>
          <p className="text-muted">
            {error ? <span className="text-danger">Offline Mode (Backend Unreachable)</span> : "Welcome back! Here is your latest summary."}
          </p>
        </div>
        <Link to="/transactions" className="btn btn-primary hidden-mobile">
          <Plus size={18} className="mr-2" />
          New Transaction
        </Link>
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
            title="Total Transactions"
            amount={totalTransactions}
            type="info"
            icon={List}
            isCount={true}
            subtitle="All time"
          />
          <SummaryCard
            title="This Month"
            amount={monthlyTotal}
            type={monthlyTotal > 0 ? 'positive' : monthlyTotal < 0 ? 'negative' : 'info'}
            icon={Calendar}
            subtitle={`${monthlyCount} transaction${monthlyCount !== 1 ? 's' : ''}`}
          />


          <SummaryCard
            title="Average Amount"
            amount={averageTransaction}
            type="info"
            icon={DollarSign}
            subtitle="Per transaction"
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