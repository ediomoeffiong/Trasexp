import React from 'react';
import './LoadingOverlay.css';

const LoadingOverlay = ({ message = 'Authenticating...' }) => {
    return (
        <div className="loading-overlay">
            <div className="loading-content">
                <div className="premium-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-core"></div>
                </div>
                <p className="loading-message">{message}</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
