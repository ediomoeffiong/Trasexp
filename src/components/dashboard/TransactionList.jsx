import React from 'react';

const TransactionItem = ({ transaction }) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(transaction.amount));

  return (
    <li className={`transaction-item ${transaction.type}`}>
      <div className="transaction-info">
        <span className="description">{transaction.description}</span>
        <span className="date">{transaction.date}</span>
      </div>
      <span className={`amount ${transaction.type}`}>
        {transaction.type === 'income' ? '+' : '-'}{formattedAmount}
      </span>
    </li>
  );
};

const TransactionList = ({ transactions }) => {
  return (
    <div className="transaction-list">
      <h3>Recent Transactions</h3>
      <ul>
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;