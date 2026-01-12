import React, { useState, useEffect } from 'react';
import SummaryCard from '../components/common/SummaryCard';
import TransactionList from '../components/dashboard/TransactionList';
import Loading from '../components/common/Loading';
import { getAllTransactions } from '../api/transactions';

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

  // Get recent transactions (last 5, sorted by date descending)
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="error-state">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="empty-state">
          <p>No transactions found.</p>
          <p>Start by adding your first transaction!</p>
          <a href="/add">Add Transaction</a>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="summary-cards">
        <SummaryCard title="Total Income" amount={totalIncome} type="income" />
        <SummaryCard title="Total Expenses" amount={totalExpenses} type="expense" />
        <SummaryCard title="Net Balance" amount={netBalance} type={netBalance >= 0 ? 'positive' : 'negative'} />
      </div>
      <TransactionList transactions={recentTransactions} />
    </div>
  );
};

export default Dashboard;