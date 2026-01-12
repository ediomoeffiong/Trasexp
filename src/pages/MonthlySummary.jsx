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
    <div className="dashboard">
      <div className="text-center" style={{ marginBottom: '2rem' }}>
        <h1 className="text-xl font-bold">Monthly Summary</h1>
        <p className="text-muted">Analyze your income and expenses.</p>
      </div>

      <div className="month-selector card" style={{ flexDirection: 'row', alignItems: 'center', padding: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="form-select"
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: '100px' }}>
          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            min="2000"
            max="2030"
            className="form-input"
          />
        </div>
      </div>

      {hasData ? (
        <>
          <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
            <SummaryCard title="Total Income" amount={totalIncome} type="income" />
            <SummaryCard title="Total Expenses" amount={totalExpenses} type="expense" />
          </div>

          <div className="card category-list">
            <h3 className="font-bold text-center" style={{ marginBottom: '1rem' }}>Category Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Object.entries(categories).map(([category, amounts]) => (
                <div key={category} className="category-item">
                  <span className="font-bold">{category}</span>
                  <div className="text-right">
                    {amounts.income > 0 && (
                      <div className="text-success text-sm">+{amounts.income?.toFixed(2)}</div>
                    )}
                    {amounts.expense > 0 && (
                      <div className="text-danger text-sm">-{amounts.expense?.toFixed(2)}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          <p>No transactions found for this month.</p>
          <p>Try selecting a different month or add some transactions!</p>
          <a href="/add" className="btn btn-primary" style={{ marginTop: '1rem', textDecoration: 'none' }}>Add Transaction</a>
        </div>
      )}
    </div>
  );
};

export default MonthlySummary;