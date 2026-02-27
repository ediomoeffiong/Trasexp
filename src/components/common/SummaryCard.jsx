import React from 'react';
import { useSettings } from '../../hooks/useSettings';
import { useAccount } from '../../context/AccountContext';
import { formatCurrency } from '../../utils/currency';

const SummaryCard = ({ title, amount, type, icon: Icon, subtitle, trend, isCount = false }) => {
  const { preferences, hideAmounts } = useSettings();
  const { selectedAccount } = useAccount();

  const currencyCode = selectedAccount?.currency || preferences?.defaultCurrency || 'NGN';

  const isPositive = type === 'income' || type === 'positive';
  const isNegative = type === 'expense' || type === 'negative';

  // Use absolute value for standard currency formatting, we'll prefix manually
  const displayAmount = isCount ? amount : Math.abs(amount);

  const formattedAmount = isCount
    ? amount.toLocaleString()
    : formatCurrency(displayAmount, currencyCode);

  // Determine prefix
  let prefix = '';
  if (!isCount && amount !== 0) {
    if (amount > 0 && isPositive) prefix = '+';
    if (amount < 0 || (amount > 0 && isNegative)) {
      prefix = '-';
    }
  }

  // Dynamic Padding & Font Size logic for ultra-long amounts
  const amountLength = (prefix + formattedAmount).length;
  let amountStyle = {};
  if (amountLength > 15) {
    amountStyle = { fontSize: '1.25rem', padding: '0px' };
  } else if (amountLength > 12) {
    amountStyle = { fontSize: '1.5rem', padding: '4px 0' };
  }

  const displayValue = hideAmounts && !isCount ? '••••' : `${prefix}${formattedAmount}`;

  let typeClass = '';
  let iconBgClass = '';

  if (isPositive) {
    typeClass = 'text-success';
    iconBgClass = 'bg-success-light';
  } else if (isNegative) {
    typeClass = 'text-danger';
    iconBgClass = 'bg-danger-light';
  } else if (type === 'info') {
    typeClass = 'text-info';
    iconBgClass = 'bg-info-light';
  } else if (type === 'warning') {
    typeClass = 'text-warning';
    iconBgClass = 'bg-warning-light';
  } else {
    typeClass = 'text-primary';
    iconBgClass = 'bg-primary-light';
  }

  return (
    <div className="card summary-card card-fade-in">
      <div className="summary-content-wrapper flex justify-between items-center w-full">
        <div className="summary-text-group">
          <h3 className="text-muted text-xs font-medium uppercase tracking-wider mb-1">{title}</h3>
          <p
            className={`summary-amount text-2xl font-bold py-2 ${typeClass}`}
            style={amountStyle}
          >
            {displayValue}
          </p>
          {subtitle && <span className="summary-subtitle text-xs text-muted block mt-1">{subtitle}</span>}

          {trend && (
            <span className={`summary-trend ${trend > 0 ? 'trend-up' : 'trend-down'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        {Icon && (
          <div className={`summary-icon-container flex-shrink-0 ${iconBgClass}`}>
            <Icon className={typeClass} size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;