import React from 'react';

import { ArrowUpRight, ArrowDownLeft, Calendar, Tag } from 'lucide-react';

const TransactionItem = ({ transaction }) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(transaction.amount));

  const isIncome = transaction.type === 'INCOME';

  // Format category for display
  const formatCategory = (category) => {
    if (!category) return 'Other';
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  return (
    <div className="transaction-item hover-effect">
      <div className="flex items-center gap-3">
        <div className={`icon-circle ${isIncome ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
          {isIncome ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
        </div>
        <div className="transaction-info">
          <span className="font-bold text-main">{transaction.title || transaction.description}</span>
          <div className="flex items-center gap-2 text-xs text-muted mt-1">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{new Date(transaction.date).toLocaleDateString()}</span>
            </div>
            {transaction.category && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Tag size={12} />
                  <span className="category-badge">{formatCategory(transaction.category)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <span className={`font-bold text-lg ${isIncome ? 'text-success' : 'text-danger'}`}>
        {isIncome ? '+' : '-'}{formattedAmount}
      </span>
    </div>
  );
};

const TransactionList = ({ transactions, showAll = false }) => {
  const displayTransactions = showAll ? transactions : transactions.slice(0, 5);
  const title = showAll ? 'All Transactions' : 'Recent Activity';

  return (
    <div className="card">
      <div className="transaction-list-header">
        <h3 className="font-bold text-lg">{title}</h3>
        {!showAll && transactions.length > 5 && (
          <span className="text-sm text-muted">
            Showing {Math.min(5, transactions.length)} of {transactions.length}
          </span>
        )}
      </div>
      <div className="transaction-list">
        {displayTransactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
};

export default TransactionList;