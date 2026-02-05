import React, { useEffect, useState } from 'react';
import { useSettings } from '../../hooks/useSettings';

const Notifications = () => {
    const { notifications, updateNotifications, loading } = useSettings();
    const [formData, setFormData] = useState({
        emailNotifications: true,
        inAppNotifications: true,
        transactionAlerts: true
    });

    useEffect(() => {
        if (notifications) {
            setFormData({
                emailNotifications: notifications.emailNotifications ?? true,
                inAppNotifications: notifications.inAppNotifications ?? true,
                transactionAlerts: notifications.transactionAlerts ?? true
            });
        }
    }, [notifications]);

    const handleToggle = (key) => {
        const newData = { ...formData, [key]: !formData[key] };
        setFormData(newData);
        // Auto-save on toggle
        updateNotifications(newData);
    };

    return (
        <div>
            <div className="settings-header">
                <h2>Notifications</h2>
                <p>Choose what you want to be notified about</p>
            </div>

            <div className="settings-section">
                <h3>General Notifications</h3>
                <div className="card">
                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Email Notifications</h4>
                            <p>Receive updates, news, and weekly summaries via email</p>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={formData.emailNotifications}
                                onChange={() => handleToggle('emailNotifications')}
                                disabled={loading}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>In-App Notifications</h4>
                            <p>Show notifications within the application dashboard</p>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={formData.inAppNotifications}
                                onChange={() => handleToggle('inAppNotifications')}
                                disabled={loading}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="settings-section">
                <h3>Alerts</h3>
                <div className="card">
                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Transaction Alerts</h4>
                            <p>Get notified when a large transaction occurs</p>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={formData.transactionAlerts}
                                onChange={() => handleToggle('transactionAlerts')}
                                disabled={loading}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Security Alerts</h4>
                            <p>Get notified about logins from new devices and security checks</p>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={true}
                                disabled={true}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
