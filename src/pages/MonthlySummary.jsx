import React, { useState, useEffect } from 'react';
import SummaryCard from '../components/common/SummaryCard';
import Loading from '../components/common/Loading';
import { getMonthlySummary } from '../api/transactions';
import {
  Calendar,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  PieChart,
  AlertCircle
} from 'lucide-react';

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
        // Fallback for demo/dev if API fails (optional, but good for stability during dev)
        // console.error("API Error", err); 
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
    return <Loading message="Analyzing finances..." />;
  }

  if (error) {
    return (
      <div className="container page-content text-center">
        <div className="bg-danger-light text-danger w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold mb-2">Could not load summary</h2>
        <p className="text-muted mb-4">{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  const { totalIncome = 0, totalExpenses = 0, categories = {} } = summaryData || {};
  const hasData = totalIncome > 0 || totalExpenses > 0 || Object.keys(categories).length > 0;

  // sort categories by expense amount desc
  const sortedCategories = Object.entries(categories)
    .sort(([, a], [, b]) => (b.expense || 0) - (a.expense || 0));

  const maxExpense = Math.max(...sortedCategories.map(([, data]) => data.expense || 0), 1);

  return (
    <div className="container page-content">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold mb-1">Monthly Summary</h1>
        <p className="text-muted">Analyze your income and expenses.</p>
      </div>

      {/* Controls */}
      <div className="card mb-8">
        <div className="flex flex-wrap gap-4 items-center justify-center p-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="form-select pl-10 pr-10 py-2 bg-transparent border-gray-200"
              style={{ minWidth: '160px' }}
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none" size={16} />
          </div>

          <div className="relative">
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              min="2000"
              max="2030"
              className="form-input text-center py-2 w-24"
            />
          </div>
        </div>
      </div>

      {hasData ? (
        <>
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
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="text-primary" size={24} />
              <h3 className="font-bold text-lg">Category Breakdown</h3>
            </div>

            <div className="flex flex-col gap-6">
              {sortedCategories.map(([category, amounts]) => {
                const expense = amounts.expense || 0;
                const percentage = Math.min((expense / totalExpenses) * 100, 100);
                const relativePercentage = Math.min((expense / maxExpense) * 100, 100);

                if (expense <= 0 && (!amounts.income || amounts.income <= 0)) return null;

                return (
                  <div key={category} className="w-full">
                    <div className="flex justify-between items-end mb-1">
                      <span className="font-bold text-main">{category}</span>
                      <div className="text-right">
                        <span className="font-bold text-danger">
                          -{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(expense)}
                        </span>
                        {/* <span className="text-xs text-muted block">{percentage.toFixed(1)}%</span> */}
                      </div>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-danger h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${relativePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}

              {sortedCategories.length === 0 && (
                <p className="text-center text-muted py-4">No Data for this period.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="card py-12 text-center">
          <div className="bg-gray-100 text-gray-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <PieChart size={40} />
          </div>
          <h2 className="text-xl font-bold mb-2">No data for this month</h2>
          <p className="text-muted mb-6">There are no transactions recorded for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}.</p>
        </div>
      )}
    </div>
  );
};

export default MonthlySummary;