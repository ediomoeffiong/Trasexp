import React, { useState, useEffect } from 'react';
import { Calendar, Tag, AlignLeft, Check, X, Wallet, Coins } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { getCurrencySymbol, formatCurrency } from '../../utils/currency';
import { useAccount } from '../../context/AccountContext';
import { getAvailableIncomes } from '../../api/transactions';

const TransactionForm = ({ onSubmit, disabled = false, initialData = null }) => {
  const { preferences } = useSettings();
  const { accounts, selectedAccountId } = useAccount();
  const currencySymbol = getCurrencySymbol(preferences?.defaultCurrency);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    amount: initialData?.amount?.toString() || '',
    type: initialData?.type?.toLowerCase() || 'expense',
    category: initialData?.category || '',
    date: initialData?.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0],
    accountId: initialData?.accountId || (selectedAccountId !== 'null' ? selectedAccountId : ''),
    fundingIncomeId: initialData?.fundingIncomeId || ''
  });

  const [displayAmount, setDisplayAmount] = useState('');
  const [errors, setErrors] = useState({});
  const [availableIncomes, setAvailableIncomes] = useState([]);
  const [loadingIncomes, setLoadingIncomes] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount?.toString() || '',
        type: initialData.type?.toLowerCase() || 'expense',
        category: initialData.category || '',
        date: initialData.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0],
        accountId: initialData.accountId || '',
        fundingIncomeId: initialData.fundingIncomeId || ''
      });

      // Handle display amount formatting
      const number = parseFloat(initialData.amount);
      if (!isNaN(number)) {
        const locale = preferences?.defaultCurrency === 'NGN' ? 'en-NG' : 'en-US';
        setDisplayAmount(number.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      }
    } else if (selectedAccountId && selectedAccountId !== 'null') {
      setFormData(prev => ({ ...prev, accountId: selectedAccountId }));
    }
  }, [initialData, preferences, selectedAccountId]);

  useEffect(() => {
    const fetchIncomes = async () => {
      if (formData.type === 'expense' && formData.accountId) {
        setLoadingIncomes(true);
        try {
          const incomes = await getAvailableIncomes({ accountId: formData.accountId });
          setAvailableIncomes(incomes);

          // If editing and we have a fundingIncomeId, preserve it even if balance is 0 now 
          // (Actually the API filters for remainingBalance > 0, so we might need to handle this)
        } catch (err) {
          console.error("Failed to fetch available incomes:", err);
        } finally {
          setLoadingIncomes(false);
        }
      } else {
        setAvailableIncomes([]);
      }
    };

    fetchIncomes();
  }, [formData.type, formData.accountId]);

  const categories = [
    { label: 'Food', value: 'FOOD' },
    { label: 'Transportation', value: 'TRANSPORT' },
    { label: 'Entertainment', value: 'ENTERTAINMENT' },
    { label: 'Utilities', value: 'UTILITIES' },
    { label: 'Salary', value: 'OTHER' },
    { label: 'Freelance', value: 'OTHER' },
    { label: 'Health', value: 'HEALTH' },
    { label: 'Shopping', value: 'OTHER' },
    { label: 'Other', value: 'OTHER' },
  ];

  const handleAmountChange = (e) => {
    // Allow digits and one decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');

    // Prevent multiple decimal points
    if ((value.match(/\./g) || []).length > 1) return;

    // Limit decimal places to 2
    if (value.includes('.') && value.split('.')[1].length > 2) return;

    setDisplayAmount(value);

    setFormData(prev => ({
      ...prev,
      amount: value,
    }));

    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  // Format on blur to add commas or .00
  const handleAmountBlur = () => {
    if (!formData.amount) return;
    const number = parseFloat(formData.amount);
    if (!isNaN(number)) {
      const locale = preferences?.defaultCurrency === 'NGN' ? 'en-NG' : 'en-US';
      setDisplayAmount(number.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }
  };

  const handleTypeChange = (newType) => {
    setFormData(prev => ({ ...prev, type: newType }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Description is required';
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid positive amount';
    }
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.accountId) newErrors.accountId = 'Destination account is required';

    if (formData.type === 'expense') {
      if (!formData.fundingIncomeId) {
        newErrors.fundingIncomeId = 'Source income is required';
      } else {
        const selectedIncome = availableIncomes.find(inc => inc.id === parseInt(formData.fundingIncomeId));
        const amount = parseFloat(formData.amount);

        // Skip balance check for initialData if it's the SAME income source (since its balance already reflects this expense in a real scenario, 
        // but here we are editing so we should subtract the OLD amount first conceptually)
        // For simplicity: check if amount > remainingBalance
        if (selectedIncome && !isNaN(amount)) {
          let available = selectedIncome.remainingBalance;
          // If we are editing, we add back the old amount to the available balance for validation
          if (initialData && initialData.fundingIncomeId === selectedIncome.id) {
            available += initialData.amount;
          }
          if (amount > available) {
            newErrors.fundingIncomeId = `Insufficient balance in selected income source. Available: ${formatCurrency(available, preferences?.defaultCurrency)}`;
          }
        }
      }
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date).setHours(0, 0, 0, 0);
      const today = new Date().setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        newErrors.date = 'Future dates are not allowed. Please select today’s date or a past date.';
      }
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const dataToSubmit = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: `${formData.date}T00:00:00`,
      type: formData.type ? formData.type.toUpperCase() : formData.type,
      accountId: formData.accountId,
      fundingIncomeId: formData.type === 'expense' ? parseInt(formData.fundingIncomeId) : null,
    };
    onSubmit(dataToSubmit);
  };

  const isIncome = formData.type === 'income';
  const themeColor = isIncome ? 'success' : 'danger';
  const themeClass = isIncome ? 'text-success' : 'text-danger';
  const bgClass = isIncome ? 'bg-success-light' : 'bg-danger-light';
  const borderClass = isIncome ? 'border-success' : 'border-danger'; // Assuming we have these or will add/use standard border

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      {/* Type Toggle */}
      <div className="flex gap-4 mb-6 justify-center">
        <button
          type="button"
          onClick={() => handleTypeChange('income')}
          className={`btn flex-1 transition-all duration-200 ${formData.type === 'income'
            ? 'bg-success text-white shadow-md transform scale-105'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          style={{ backgroundColor: formData.type === 'income' ? 'var(--success-color)' : '#f3f4f6', color: formData.type === 'income' ? 'white' : '#6b7280' }}
        >
          Income
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('expense')}
          className={`btn flex-1 transition-all duration-200 ${formData.type === 'expense'
            ? 'bg-danger text-white shadow-md transform scale-105'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          style={{ backgroundColor: formData.type === 'expense' ? 'var(--danger-color)' : '#f3f4f6', color: formData.type === 'expense' ? 'white' : '#6b7280' }}
        >
          Expense
        </button>
      </div>

      {/* Amount Input */}
      <div className="form-group mb-8">
        <label className={`block text-center text-sm font-bold mb-2 uppercase tracking-wide ${themeClass}`}>
          Amount
        </label>
        <div className="relative max-w-xs mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={`text-2xl font-bold ${themeClass}`}>{currencySymbol}</span>
          </div>
          <input
            type="text"
            inputMode="decimal"
            name="amount"
            value={displayAmount}
            onChange={handleAmountChange}
            onBlur={handleAmountBlur}
            className={`form-input text-center text-3xl font-bold py-6 pl-8 pr-4 shadow-sm ${errors.amount ? 'border-red-500' : ''}`}
            placeholder="0.00"
            style={{ height: 'auto', color: isIncome ? 'var(--success-color)' : 'var(--danger-color)' }}
          />
        </div>
        {errors.amount && <p className="text-danger text-center text-sm mt-1">{errors.amount}</p>}
      </div>

      <div className="grid gap-4">
        {/* Account Selection (Mandatory) */}
        <div className="form-group">
          <label htmlFor="accountId" className="form-label flex items-center gap-2 text-muted">
            <Wallet size={16} /> Destination Account
          </label>
          <select
            id="accountId"
            name="accountId"
            value={formData.accountId}
            onChange={handleChange}
            className={`form-select ${errors.accountId ? 'border-red-500' : ''}`}
          >
            <option value="">Select Account</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.name} ({formatCurrency(acc.balance, preferences?.defaultCurrency)})</option>
            ))}
          </select>
          {errors.accountId && <span className="text-danger text-sm">{errors.accountId}</span>}
        </div>

        {/* Income Source Selection (FOR EXPENSES ONLY) */}
        {!isIncome && (
          <div className="form-group slide-in">
            <label htmlFor="fundingIncomeId" className="form-label flex items-center gap-2 text-muted">
              <Coins size={16} /> Deduct From
            </label>
            <select
              id="fundingIncomeId"
              name="fundingIncomeId"
              value={formData.fundingIncomeId}
              onChange={handleChange}
              className={`form-select ${errors.fundingIncomeId ? 'border-red-500' : ''}`}
              disabled={loadingIncomes}
            >
              <option value="">{loadingIncomes ? 'Loading incomes...' : 'Select Income Source'}</option>
              {availableIncomes.map(inc => (
                <option key={inc.id} value={inc.id}>
                  {inc.title} ({formatCurrency(inc.remainingBalance, preferences?.defaultCurrency)} available)
                </option>
              ))}
              {!loadingIncomes && availableIncomes.length === 0 && (
                <option disabled>No income sources available in this account</option>
              )}
            </select>
            {errors.fundingIncomeId && <span className="text-danger text-sm">{errors.fundingIncomeId}</span>}
            {!errors.fundingIncomeId && availableIncomes.length === 0 && !isIncome && formData.accountId && !loadingIncomes && (
              <p className="text-amber-600 text-[11px] mt-1 flex items-center gap-1">
                <Check size={10} /> You need to add income to this account first.
              </p>
            )}
          </div>
        )}

        {/* Title */}
        <div className="form-group">
          <label htmlFor="title" className="form-label flex items-center gap-2 text-muted">
            <AlignLeft size={16} /> Description
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`form-input ${errors.title ? 'border-red-500' : ''}`}
            placeholder="What was this for?"
          />
          {errors.title && <span className="text-danger text-sm">{errors.title}</span>}
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category" className="form-label flex items-center gap-2 text-muted">
            <Tag size={16} /> Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`form-select ${errors.category ? 'border-red-500' : ''}`}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={`${cat.value}_${cat.label}`} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          {errors.category && <span className="text-danger text-sm">{errors.category}</span>}
        </div>

        {/* Date */}
        <div className="form-group">
          <label htmlFor="date" className="form-label flex items-center gap-2 text-muted">
            <Calendar size={16} /> Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className={`form-input ${errors.date ? 'border-red-500' : ''}`}
          />
          {errors.date && <span className="text-danger text-sm">{errors.date}</span>}
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={disabled}
          className={`btn btn-block py-3 text-lg transition-transform active:scale-95 ${isIncome ? 'btn-success' : 'btn-danger'
            }`}
          style={{
            backgroundColor: isIncome ? 'var(--success-color)' : 'var(--danger-color)',
            color: 'white'
          }}
        >
          {disabled ? 'Saving...' : initialData ? 'Update Transaction' : 'Save Transaction'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;