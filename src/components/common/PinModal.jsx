import React, { useState } from 'react';

const PinModal = ({ isOpen, onClose, onVerify, accountName }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pin.length < 4) {
            setError('PIN must be at least 4 digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const isValid = await onVerify(pin);
            if (isValid) {
                onClose();
                setPin('');
            } else {
                setError('Incorrect PIN. Please try again.');
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container pin-modal">
                <div className="modal-header">
                    <h3>Enter PIN</h3>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <p>Please enter the PIN for <strong>{accountName}</strong> to continue.</p>
                        <div className="form-group mt-4">
                            <input
                                type="password"
                                className={`form-control ${error ? 'is-invalid' : ''}`}
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                placeholder="Enter PIN"
                                autoFocus
                                maxLength={8}
                            />
                            {error && <div className="invalid-feedback text-danger mt-1">{error}</div>}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PinModal;
