import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import AccountProfile from './AccountProfile';
import Security from './Security';
import Notifications from './Notifications';
import Preferences from './Preferences';
import Compliance from './Compliance';
import DangerZone from './DangerZone';
import Loading from '../../components/common/Loading';
import './Settings.css';

// SVGs for Tabs
const ProfileIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const SecurityIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);
const BellIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);
const SlidersIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
);
const ShieldIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);
const AlertIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);

const Settings = () => {
    const { loadAllSettings, pageLoading, profile } = useSettings();
    const [activeTab, setActiveTab] = useState('account');

    useEffect(() => {
        loadAllSettings();
    }, [loadAllSettings]);

    if (pageLoading && !profile) {
        return <div className="page-content container"><Loading /></div>;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'account': return <AccountProfile />;
            case 'security': return <Security />;
            case 'notifications': return <Notifications />;
            case 'preferences': return <Preferences />;
            case 'compliance': return <Compliance />;
            case 'danger': return <DangerZone />;
            default: return <AccountProfile />;
        }
    };

    return (
        <div className="page-content container">
            <div className="mb-6">
                <h1>Settings</h1>
                <p className="text-muted">Manage your account settings and preferences</p>
            </div>

            <div className="settings-container">
                <div className="settings-sidebar">
                    <button
                        className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
                        onClick={() => setActiveTab('account')}
                    >
                        <ProfileIcon /> Account Profile
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <SecurityIcon /> Security
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <BellIcon /> Notifications
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'preferences' ? 'active' : ''}`}
                        onClick={() => setActiveTab('preferences')}
                    >
                        <SlidersIcon /> Preferences
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'compliance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('compliance')}
                    >
                        <ShieldIcon /> Compliance
                    </button>
                    <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 1rem' }}></div>
                    <button
                        className={`settings-tab danger ${activeTab === 'danger' ? 'active' : ''}`}
                        onClick={() => setActiveTab('danger')}
                    >
                        <AlertIcon /> Danger Zone
                    </button>
                </div>

                <div className="settings-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Settings;
