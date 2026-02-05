import React, { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DangerZone = () => {
    const { deactivateAccount, deleteAccount, loading } = useSettings();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [action, setAction] = useState(null); // 'deactivate' or 'delete'
    const [password, setPassword] = useState('');

    const handleAction = async (e) => {
        e.preventDefault();
        try {
            if (action === 'deactivate') {
                await deactivateAccount(password);
                logout();
                navigate('/');
            } else if (action === 'delete') {
                await deleteAccount(password);
                logout();
                navigate('/');
            }
        } catch (error) {
            // Error handled in hook
        }
    };

    return (
        <div>
            <div className="settings-header">
                <h2 className="text-danger">Danger Zone</h2>
                <p>Irreversible and destructive actions</p>
            </div>

            <div className="settings-section">
                <h3>Deactivate Account</h3>
                <div className="card" style={{ border: '1px solid var(--warning-color)' }}>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="mb-1"><strong>Deactivate your account</strong></p>
                            <p className="text-muted text-sm">Temporarily disable your account. You can reactivate it later.</p>
                        </div>
                        {action !== 'deactivate' && (
                            <button
                                className="btn"
                                style={{ borderColor: 'var(--warning-color)', color: 'var(--warning-color)', border: '1px solid' }}
                                onClick={() => { setAction('deactivate'); setPassword(''); }}
                            >
                                Deactivate
                            </button>
                        )}
                    </div>

                    {action === 'deactivate' && (
                        <form onSubmit={handleAction} className="card-fade-in p-4 bg-gray-50 rounded-lg">
                            <p className="mb-4 text-sm">Please enter your password to confirm deactivation.</p>
                            <div className="form-group">
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setAction(null)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn"
                                    style={{ backgroundColor: 'var(--warning-color)', color: 'white' }}
                                    disabled={loading}
                                >
                                    {loading ? 'Deactivating...' : 'Confirm Deactivation'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <div className="settings-section">
                <h3>Delete Account</h3>
                <div className="card" style={{ border: '1px solid var(--danger-color)' }}>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="mb-1 text-danger"><strong>Delete your account</strong></p>
                            <p className="text-muted text-sm">Permanently delete your account and all data. This cannot be undone.</p>
                        </div>
                        {action !== 'delete' && (
                            <button
                                className="btn btn-danger"
                                onClick={() => { setAction('delete'); setPassword(''); }}
                            >
                                Delete Account
                            </button>
                        )}
                    </div>

                    {action === 'delete' && (
                        <form onSubmit={handleAction} className="card-fade-in p-4 bg-danger-light rounded-lg">
                            <p className="mb-4 text-sm font-bold text-danger">Warning: This action is permanent. Please enter your password to confirm.</p>
                            <div className="form-group">
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setAction(null)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-danger"
                                    disabled={loading}
                                >
                                    {loading ? 'Deleting...' : 'Confirm Deletion'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DangerZone;
