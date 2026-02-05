import React from 'react';

const Compliance = () => {
    return (
        <div>
            <div className="settings-header">
                <h2>Compliance</h2>
                <p>View legal information and account verification status</p>
            </div>

            <div className="settings-section">
                <h3>Verification Status</h3>
                <div className="card">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="mb-1"><strong>KYC Status</strong></p>
                            <p className="text-muted text-sm">Know Your Customer identity verification</p>
                        </div>
                        <span className="badge badge-success" style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            color: 'var(--success-color)',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                        }}>
                            VERIFIED
                        </span>
                    </div>
                </div>
            </div>

            <div className="settings-section">
                <h3>Legal Documents</h3>
                <div className="card">
                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Terms of Service</h4>
                            <p>Read our latest terms of service</p>
                        </div>
                        <button className="btn">View</button>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Privacy Policy</h4>
                            <p>Learn how we process your data</p>
                        </div>
                        <button className="btn">View</button>
                    </div>
                </div>
            </div>

            <div className="settings-section">
                <h3>Data Rights</h3>
                <div className="card">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="mb-1"><strong>Export Account Data</strong></p>
                            <p className="text-muted text-sm">Download a copy of your personal data</p>
                        </div>
                        <button className="btn">Download Archive</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Compliance;
