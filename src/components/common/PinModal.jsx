import React, { useState, useRef, useEffect } from 'react';
import './PinModal.css';

const PinModal = ({ isOpen, onClose, onVerify, accountName }) => {
    const [pin, setPin] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];

    useEffect(() => {
        if (isOpen) {
            setPin(['', '', '', '']);
            setError('');
            setIsShaking(false);
            setTimeout(() => {
                if (inputRefs[0].current) inputRefs[0].current.focus();
            }, 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value.substring(value.length - 1);
        setPin(newPin);

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
        if (e.key === 'Enter' && pin.every(digit => digit !== '')) {
            handleSubmit(e);
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const pinString = pin.join('');
        if (pinString.length < 4) return;

        setLoading(true);
        setError('');
        setIsShaking(false);

        try {
            const isValid = await onVerify(pinString);
            if (isValid) {
                onClose();
            } else {
                setError('Incorrect PIN. Please try again.');
                setIsShaking(true);
                setPin(['', '', '', '']);
                inputRefs[0].current.focus();
                setTimeout(() => setIsShaking(false), 500);
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
        } finally {
            setLoading(false);
        }
    };

    const isPinComplete = pin.every(digit => digit !== '');

    return (
        <div className="pin-modal-overlay" onClick={(e) => e.target.className === 'pin-modal-overlay' && onClose()}>
            <div className={`pin-modal-card ${isShaking ? 'shake' : ''}`}>
                <div className="pin-modal-header">
                    <div className="lock-icon-wrapper">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                    <h3>Security Verification</h3>
                    <p>Enter the PIN for <strong>{accountName}</strong></p>
                </div>

                <div className="pin-modal-body">
                    <div className="pin-inputs">
                        {pin.map((digit, index) => (
                            <input
                                key={index}
                                ref={inputRefs[index]}
                                type="password"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className={`pin-box ${error ? 'error' : ''}`}
                                disabled={loading}
                                autoComplete="off"
                            />
                        ))}
                    </div>
                    {error && <p className="pin-error-message">{error}</p>}
                </div>

                <div className="pin-modal-actions">
                    <button
                        className="btn-pin-cancel"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className={`btn-pin-verify ${isPinComplete ? 'active' : ''}`}
                        onClick={handleSubmit}
                        disabled={loading || !isPinComplete}
                    >
                        {loading ? (
                            <span className="button-loader"></span>
                        ) : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PinModal;
