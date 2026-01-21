import React from 'react';

const CardSkeleton = () => {
    return (
        <div className="card summary-card skeleton-card">
            <div className="summary-content">
                <div className="skeleton-text-group">
                    <div className="skeleton-text skeleton-title"></div>
                    <div className="skeleton-text skeleton-amount"></div>
                </div>
                <div className="skeleton-icon"></div>
            </div>
        </div>
    );
};

export default CardSkeleton;
