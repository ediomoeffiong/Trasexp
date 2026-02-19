import React from 'react';
import { useSettings } from '../../hooks/useSettings';
import { formatCurrency } from '../../utils/currency';

import { ArrowUpRight, ArrowDownLeft, Calendar, Tag, Edit2, Trash2, X } from 'lucide-react';

const TransactionItem = ({ transaction, showActions = false, onEdit, onDelete }) => {
  const { preferences, hideAmounts } = useSettings();
  const [showDelete, setShowDelete] = React.useState(false);
  const currencyCode = preferences?.defaultCurrency || 'NGN';

  const formattedAmount = formatCurrency(Math.abs(transaction.amount), currencyCode);
  const isIncome = transaction.type === 'INCOME';

  const amountDisplay = hideAmounts ? '••••' : `${isIncome ? '+' : '-'}${formattedAmount}`;

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
                  className="p-1.5 text-muted hover:bg-gray-100 rounded-md transition-colors"
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