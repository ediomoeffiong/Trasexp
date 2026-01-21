import React from 'react';

const SummaryCard = ({ title, amount, type, icon: Icon, subtitle, trend, isCount = false }) => {
  // Format amount based on whether it's a count or currency
  const formattedAmount = isCount
    ? amount.toLocaleString()
    : new Intl.NumberFormat('en-US', {
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
  } else if (type === 'info') {
    typeClass = 'text-info';
    iconBgClass = 'bg-info-light';
  } else {
    typeClass = 'text-primary';
    iconBgClass = 'bg-primary-light';
  }

  return (
    <div className="card summary-card card-fade-in">
      <div className="summary-content">
        <div className="summary-text-group">
          <h3>{title}</h3>
          <p className={`summary-amount ${typeClass}`}>{formattedAmount}</p>
          {subtitle && <span className="summary-subtitle">{subtitle}</span>}
          {trend && (
            <span className={`summary-trend ${trend > 0 ? 'trend-up' : 'trend-down'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
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