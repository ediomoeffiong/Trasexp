import React from 'react';

const SummaryCard = ({ title, amount, type }) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  return (
    <div className={`summary-card ${type}`}>
      <h3>{title}</h3>
      <p className="amount">{formattedAmount}</p>
    </div>
  );
};

export default SummaryCard;