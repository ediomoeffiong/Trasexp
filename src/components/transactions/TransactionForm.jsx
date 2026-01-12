import React, { useState } from 'react';

const TransactionForm = ({ onSubmit, disabled = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    date: '',
  });

  const [errors, setErrors] = useState({});

  const categories = [
    'Food',
    'Transportation',
    'Entertainment',
    'Utilities',
    'Salary',
    'Freelance',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Convert amount to number
    const dataToSubmit = {
      ...formData,
      amount: parseFloat(formData.amount),
    };
    onSubmit(dataToSubmit);
    // Reset form
    setFormData({
      title: '',
      amount: '',
      type: 'expense',
      category: '',
      date: '',
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title" className="form-label">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`form-input ${errors.title ? 'error' : ''}`}
          placeholder="e.g. Grocery Shopping"
        />
        {errors.title && <span className="text-danger text-sm">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="amount" className="form-label">Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          step="0.01"
          min="0"
          className={`form-input ${errors.amount ? 'error' : ''}`}
          placeholder="0.00"
        />
        {errors.amount && <span className="text-danger text-sm">{errors.amount}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="type" className="form-label">Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="form-select"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="category" className="form-label">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`form-select ${errors.category ? 'error' : ''}`}
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <span className="text-danger text-sm">{errors.category}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="date" className="form-label">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className={`form-input ${errors.date ? 'error' : ''}`}
        />
        {errors.date && <span className="text-danger text-sm">{errors.date}</span>}
      </div>

      <button type="submit" disabled={disabled} className="btn btn-primary btn-block">
        Add Transaction
      </button>
    </form>
  );
};

export default TransactionForm;