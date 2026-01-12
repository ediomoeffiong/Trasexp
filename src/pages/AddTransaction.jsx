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
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="text-center" style={{ marginBottom: '2rem' }}>
        <h1 className="text-xl font-bold">Add Transaction</h1>
        <p className="text-muted">Record a new income or expense.</p>
      </div>

      <div className="card">
        {error && (
          <div className="error-banner">
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
    </div>
  );
};

export default AddTransaction;