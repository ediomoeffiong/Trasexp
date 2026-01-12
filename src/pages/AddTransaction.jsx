import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionForm from '../components/transactions/TransactionForm';
import Loading from '../components/common/Loading';
import { createTransaction } from '../api/transactions';

const AddTransaction = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError(null);
    try {
      await createTransaction(formData);
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data) {
        // Assume backend returns validation errors as { field: 'message' }
        setError(err.response.data);
      } else {
        setError({ general: 'Failed to add transaction. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Add Transaction</h1>
      {error && (
        <div className="error-state">
          {typeof error === 'string' ? (
            <p>{error}</p>
          ) : (
            Object.entries(error).map(([field, message]) => (
              <p key={field}><strong>{field}:</strong> {message}</p>
            ))
          )}
        </div>
      )}
      {submitting ? (
        <Loading message="Adding transaction..." />
      ) : (
        <TransactionForm onSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default AddTransaction;