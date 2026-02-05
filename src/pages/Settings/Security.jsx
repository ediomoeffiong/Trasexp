import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import ConfirmModal from '../../components/common/ConfirmModal';

const Security = () => {
    const {
        changePassword,
        sessions,
        loginHistory,
        fetchSecurityData,
        terminateSession,
        loading
    } = useSettings();

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPasswordForm, setShowPasswordForm] = useState(false);

    useEffect(() => {
        fetchSecurityData();
        // Set up polling for security data (every 30s)
        const interval = setInterval(fetchSecurityData, 30000);
        return () => clearInterval(interval);
    }, [fetchSecurityData]);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            await changePassword(passwordData);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setShowPasswordForm(false);
        } catch (error) {
            // Error handled in hook
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    return (
        <div>
            <div className="settings-header">
                <h2>Security</h2>
                <p>Manage your password and security settings</p>
            </div>

            {/* Password Section */}
            <div className="settings-section">
                <h3>Password</h3>
                <div className="card">
                    {!showPasswordForm ? (
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="mb-1"><strong>Password</strong></p>
                                <p className="text-muted text-sm">Last changed: {loginHistory[0]?.loginTime ? formatDate(loginHistory[0].loginTime) : 'Unknown'}</p>
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowPasswordForm(true)}
                            >
                                Change Password
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="form-group">
                                <label className="form-label">Current Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="settings-grid two-col">
                                <div className="form-group">
                                    <label className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        minLength="6"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        minLength="6"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end mt-4">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setShowPasswordForm(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* 2FA Section - Placeholder for now */}
            <div className="settings-section">
                <h3>Two-Factor Authentication</h3>
                <div className="card flex justify-between items-center">
                    <div>
                        <p className="mb-1"><strong>Two-Factor Authentication (2FA)</strong></p>
                        <p className="text-muted text-sm">Add an extra layer of security to your account</p>
                    </div>
                    <button className="btn" disabled>Coming Soon</button>
                </div>
            </div>

            {/* Active Sessions */}
            <div className="settings-section">
                <h3>Active Sessions</h3>
                <div className="card p-0" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'var(--bg-input)' }}>
                            <tr>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem' }}>Device</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem' }}>Location & IP</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem' }}>Last Active</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.875rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.length > 0 ? (
                                sessions.map(session => (
                                    <tr key={session.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div className="font-bold">{session.device}</div>
                                            <div className="text-xs text-muted">{session.userAgent?.substring(0, 30)}...</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div>{session.location}</div>
                                            <div className="text-xs text-muted">{session.ipAddress}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div className="text-sm">{formatDate(session.lastAccessedAt)}</div>
                                            {session.isCurrent && <span className="text-xs text-success font-bold">Current Session</span>}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            {!session.isCurrent && (
                                                <button
                                                    className="btn btn-danger"
                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                    onClick={() => terminateSession(session.id)}
                                                >
                                                    Revoke
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No active sessions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Login History */}
            <div className="settings-section">
                <h3>Recent Login Activity</h3>
                <div className="card p-0" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'var(--bg-input)' }}>
                            <tr>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem' }}>Date & Time</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem' }}>Device</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem' }}>IP Address</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.875rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loginHistory.length > 0 ? (
                                loginHistory.map(record => (
                                    <tr key={record.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{formatDate(record.loginTime)}</td>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{record.device}</td>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{record.ipAddress}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            {record.success ? (
                                                <span className="text-success text-sm font-bold">Success</span>
                                            ) : (
                                                <span className="text-danger text-sm font-bold">Failed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No login history found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Security;
