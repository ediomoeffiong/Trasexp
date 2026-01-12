import React from 'react';

const TransactionItem = ({ transaction }) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(transaction.amount));

  const isIncome = transaction.type === 'income';

  return (
    <div className="transaction-item">
      <div className="transaction-info">
        <span className="font-bold">{transaction.description}</span>
        <span className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</span>
      </div>
      <span className={`font-bold ${isIncome ? 'text-success' : 'text-danger'}`}>
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