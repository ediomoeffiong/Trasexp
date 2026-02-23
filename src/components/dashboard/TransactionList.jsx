import React from 'react';
import { useAccount } from '../../context/AccountContext';
import { useSettings } from '../../hooks/useSettings';
import { formatCurrency } from '../../utils/currency';
import { ArrowDownLeft, ArrowUpRight, Calendar, Tag, Wallet, Trash2, X, Edit2, Coins, Info } from 'lucide-react';

const TransactionItem = ({ transaction, showActions = false, onEdit, onDelete }) => {
  const { preferences, hideAmounts } = useSettings();
  const { selectedAccountId } = useAccount();
  const [showDelete, setShowDelete] = React.useState(false);
  const currencyCode = preferences?.defaultCurrency || 'NGN';

  const formattedAmount = formatCurrency(Math.abs(transaction.amount), currencyCode);
  const isIncome = transaction.type === 'INCOME';

  const amountDisplay = hideAmounts ? '••••' : `${isIncome ? '+' : '-'}${formattedAmount}`;

  // Calculate allocation percentage for income
  const allocationPercentage = isIncome ? (transaction.allocatedAmount / transaction.amount) * 100 : 0;
  const remainingPercent = 100 - allocationPercentage;

  // Format category for display
  const formatCategory = (category) => {
    if (!category) return 'Other';
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (!showDelete) {
      setShowDelete(true);
      if (onEdit) onEdit(transaction);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(transaction.id || transaction);
  };

  const handleCancelClick = (e) => {
    e.stopPropagation();
    setShowDelete(false);
  };

  return (
    <div className="transaction-item hover-effect group">
      <div className="flex items-center gap-3 flex-1">
        <div className={`icon-circle ${isIncome ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
          {isIncome ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
        </div>
        <div className="transaction-info flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-main">{transaction.title || transaction.description}</span>
            {transaction.fundingIncomeTitle && !isIncome && (
              <span className="text-[10px] bg-info-light text-info px-1.5 py-0.5 rounded border border-border-nav flex items-center gap-1">
                <Coins size={10} /> {transaction.fundingIncomeTitle}
              </span>
            )}
          </div>

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
            {selectedAccountId === null && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Wallet size={12} />
                  <span className="account-badge">{transaction.accountName || 'Unknown Account'}</span>
                </div>
              </>
            )}
          </div>

          {/* Allocation Progress for Income */}
          {isIncome && transaction.amount > 0 && (
            <div className="mt-2 w-full max-w-[200px]">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-muted">Allocation</span>
                <span className={remainingPercent > 0 ? 'text-success font-medium' : 'text-amber-600 font-medium'}>
                  {formatCurrency(transaction.remainingBalance, currencyCode)} remaining
                </span>
              </div>
              <div className="h-1 w-full bg-input rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${remainingPercent < 10 ? 'bg-amber-500' : 'bg-success'}`}
                  style={{ width: `${allocationPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {showActions && (
          <div className="flex items-center gap-2 transition-all duration-300">
            {showDelete ? (
              <>
                <button
                  onClick={handleDeleteClick}
                  className="p-1.5 text-danger hover:bg-danger-light rounded-md transition-colors"
                  title="Confirm Delete"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={handleCancelClick}
                  className="p-1.5 text-muted hover:bg-input rounded-md transition-colors"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={handleEditClick}
                className="p-1.5 text-primary hover:bg-primary-light rounded-md transition-colors"
                title="Edit / Delete"
              >
                <Edit2 size={16} />
              </button>
            )}
          </div>
        )}
        <span
          className={`font-bold text-lg px-4 ${isIncome ? 'text-success' : 'text-danger'} whitespace-nowrap`}
          style={amountDisplay.length > 15 ? { fontSize: '0.9rem', padding: '0 4px' } : {}}
        >
          {amountDisplay}
        </span>
      </div>
    </div>
  );
};

const TransactionList = ({ transactions, showAll = false, onEdit, onDelete }) => {
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
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            showActions={showAll}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default TransactionList;