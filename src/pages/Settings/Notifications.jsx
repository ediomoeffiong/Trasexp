import React, { useEffect, useState } from 'react';
import { useSettings } from '../../hooks/useSettings';

const Notifications = () => {
    const { notifications, updateNotifications, loading } = useSettings();
    const [formData, setFormData] = useState({
        emailNotifications: true,
        inAppNotifications: true,
        transactionAlerts: true,
        pushNotifications: true,
        smsNotifications: false,
        marketingEmails: true,
        weeklySummary: true,
        taxReportNotifications: true
    });

    useEffect(() => {
        if (notifications) {
            setFormData({
                emailNotifications: notifications.emailNotifications ?? true,
                inAppNotifications: notifications.inAppNotifications ?? true,
                transactionAlerts: notifications.transactionAlerts ?? true,
                pushNotifications: notifications.pushNotifications ?? true,
                smsNotifications: notifications.smsNotifications ?? false,
                marketingEmails: notifications.marketingEmails ?? true,
                weeklySummary: notifications.weeklySummary ?? true,
                taxReportNotifications: notifications.taxReportNotifications ?? true
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

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Push Notifications</h4>
                            <p>Receive push notifications on your mobile device</p>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={formData.pushNotifications}
                                onChange={() => handleToggle('pushNotifications')}
                                disabled={loading}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>SMS Notifications</h4>
                            <p>Receive critical alerts via SMS (charges may apply)</p>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={formData.smsNotifications}
                                onChange={() => handleToggle('smsNotifications')}
                                disabled={loading}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="settings-section">
                <h3>Marketing & Reports</h3>
                <div className="card">
                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Weekly Summary</h4>
                            <p>Receive a weekly report of your spending habits</p>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={formData.weeklySummary}
                                onChange={() => handleToggle('weeklySummary')}
                                disabled={loading}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Tax Report Notifications</h4>
                            <p>Get notified when your tax reports are ready for download</p>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={formData.taxReportNotifications}
                                onChange={() => handleToggle('taxReportNotifications')}
                                disabled={loading}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Marketing Emails</h4>
                            <p>Receive offers, tips, and product updates</p>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={formData.marketingEmails}
                                onChange={() => handleToggle('marketingEmails')}
                                disabled={loading}
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
