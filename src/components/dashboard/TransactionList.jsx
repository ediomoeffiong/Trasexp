import React from 'react';

import { ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';

const TransactionItem = ({ transaction }) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(transaction.amount));

  const isIncome = transaction.type === 'income';

  return (
    <div className="transaction-item hover-effect">
      <div className="flex items-center gap-3">
        <div className={`icon-circle ${isIncome ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
          {isIncome ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
        </div>
        <div className="transaction-info">
          <span className="font-bold text-main">{transaction.description}</span>
          <div className="flex items-center gap-1 text-xs text-muted">
            <Calendar size={12} />
            <span>{new Date(transaction.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <span className={`font-bold text-lg ${isIncome ? 'text-success' : 'text-danger'}`}>
        {isIncome ? '+' : '-'}{formattedAmount}
      </span>
    </div>
  );
};

const TransactionList = ({ transactions }) => {
  return (
    <div className="card">
      <div className="transaction-list-header">
        <h3 className="font-bold text-lg">Recent Activity</h3>
      </div>
      <div className="transaction-list">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
};

export default TransactionList;