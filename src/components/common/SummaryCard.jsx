import React from 'react';

const SummaryCard = ({ title, amount, type, icon: Icon }) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  let typeClass = '';
  let iconBgClass = '';
  
  if (type === 'income' || type === 'positive') {
    typeClass = 'text-success';
    iconBgClass = 'bg-success-light';
  } else if (type === 'expense' || type === 'negative') {
    typeClass = 'text-danger';
    iconBgClass = 'bg-danger-light';
  } else {
    typeClass = 'text-primary';
    iconBgClass = 'bg-primary-light';
  }

  return (
    <div className="card summary-card">
      <div className="summary-content">
        <div>
          <h3>{title}</h3>
          <p className={`summary-amount ${typeClass}`}>{formattedAmount}</p>
        </div>
        {Icon && (
          <div className={`summary-icon-container ${iconBgClass}`}>
            <Icon className={typeClass} size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;