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
        const data = await getAllTransactions();
        setTransactions(data);
      } catch (err) {
        // Mock data for development if API fails or is empty, to show UI
        // In production you might want to handle this differently
        console.error("API Error, using fallback data for demo if needed", err);
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = Math.abs(
    transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const netBalance = totalIncome - totalExpenses;

  // Calculate additional metrics
  const totalTransactions = transactions.length;

  // Get current month's transactions
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
    return t.type === 'income' ? sum + t.amount : sum - Math.abs(t.amount);
  }, 0);

  // Calculate average transaction amount
  const averageTransaction = totalTransactions > 0
    ? (totalIncome + totalExpenses) / totalTransactions
    : 0;

  // Get recent transactions (last 5, sorted by date descending)
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="dashboard container page-content">
        <div className="dashboard-header mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Financial Overview</h1>
            <p className="text-muted">Loading your latest summary...</p>
          </div>
        </div>
        <div className="dashboard-grid">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard container page-content">
        <div className="error-state text-center">
          <div className="error-icon bg-danger-light text-danger mb-4 mx-auto w-16 h-16 rounded-full flex items-center justify-center">
            <TrendingDown size={32} />
          </div>
          <h2 className="text-xl font-bold mb-2">Oops! Something went wrong.</h2>
          <p className="text-muted mb-4">{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="dashboard container page-content">
        <div className="dashboard-header mb-8">
          <h1 className="text-2xl font-bold">Financial Overview</h1>
          <p className="text-muted">Welcome back! Start tracking your finance.</p>
        </div>
        <div className="empty-state card text-center py-12">
          <div className="bg-primary-light text-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet size={40} />
          </div>
          <h2 className="text-xl font-bold mb-2">No transactions yet</h2>
          <p className="text-muted mb-6">Add your first income or expense to see your dashboard come to life.</p>
          <Link to="/add" className="btn btn-primary">
            <Plus size={20} className="mr-2" />
            Add Transaction
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard container page-content">
      <div className="dashboard-header mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1">Financial Overview</h1>
          <p className="text-muted">Welcome back! Here is your latest summary.</p>
        </div>
        <Link to="/add" className="btn btn-primary hidden-mobile">
          <Plus size={18} className="mr-2" />
          New Transaction
        </Link>
      </div>

      <div className="dashboard-grid">
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
          type={monthlyTotal >= 0 ? 'positive' : 'negative'}
          icon={Calendar}
          subtitle={`${monthlyCount} transaction${monthlyCount !== 1 ? 's' : ''}`}
        />
        <SummaryCard
          title="Average Transaction"
          amount={averageTransaction}
          type="info"
          icon={DollarSign}
          subtitle="Per transaction"
        />
      </div>

      <TransactionList transactions={recentTransactions} />
    </div>
  );
};

export default Dashboard;