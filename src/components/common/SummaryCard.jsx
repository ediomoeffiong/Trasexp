import React from 'react';

const SummaryCard = ({ title, amount, type }) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  let amountClass = 'summary-amount';
  if (type === 'income' || type === 'positive') amountClass += ' text-success';
  if (type === 'expense' || type === 'negative') amountClass += ' text-danger';

  return (
    <div className="card summary-card">
      <h3>{title}</h3>
      <p className={amountClass}>{formattedAmount}</p>
    </div>
  );
};

export default SummaryCard;