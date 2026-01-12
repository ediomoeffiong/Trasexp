import React, { useState, useEffect } from 'react';
import SummaryCard from '../components/common/SummaryCard';
import Loading from '../components/common/Loading';
import { getMonthlySummary } from '../api/transactions';

const MonthlySummary = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMonthlySummary(selectedYear, selectedMonth);
        setSummaryData(data);
      } catch (err) {
        setError('Failed to load monthly summary');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [selectedMonth, selectedYear]);

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  if (loading) {
    return <Loading message="Loading monthly summary..." />;
  }

  if (error) {
    return (
      <div className="monthly-summary">
        <h1>Monthly Summary</h1>
        <div className="error-state">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  const { totalIncome = 0, totalExpenses = 0, categories = {} } = summaryData || {};

  const hasData = totalIncome > 0 || totalExpenses > 0 || Object.keys(categories).length > 0;

  return (
    <div className="monthly-summary">
      <h1>Monthly Summary</h1>
      <div className="month-selector">
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
          {months.map(month => (
            <option key={month.value} value={month.value}>{month.label}</option>
          ))}
        </select>
        <input
          type="number"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          min="2000"
          max="2030"
        />
      </div>
      {hasData ? (
        <>
          <div className="summary-cards">
            <SummaryCard title="Total Income" amount={totalIncome} type="income" />
            <SummaryCard title="Total Expenses" amount={totalExpenses} type="expense" />
          </div>
          <div className="category-breakdown">
            <h3>Category Breakdown</h3>
            <ul>
              {Object.entries(categories).map(([category, amounts]) => (
                <li key={category} className="category-item">
                  <span className="category-name">{category}</span>
                  <span className="income-amount">+${amounts.income?.toFixed(2) || '0.00'}</span>
                  <span className="expense-amount">-${amounts.expense?.toFixed(2) || '0.00'}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>No transactions found for this month.</p>
          <p>Try selecting a different month or add some transactions!</p>
          <a href="/add">Add Transaction</a>
        </div>
      )}
    </div>
  );
};

export default MonthlySummary;