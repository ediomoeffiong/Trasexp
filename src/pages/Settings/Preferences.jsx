import React, { useEffect, useState } from 'react';
import { useSettings } from '../../hooks/useSettings';

const Preferences = () => {
    const { preferences, updatePreferences, loading } = useSettings();
    const [formData, setFormData] = useState({
        theme: 'SYSTEM',
        language: 'en',
        defaultCurrency: 'USD',
        defaultCategory: 'General',
        autoCategorizationToggle: true,
        taxCalculationToggle: false
    });

    useEffect(() => {
        if (preferences) {
            setFormData({
                theme: preferences.theme || 'SYSTEM',
                language: preferences.language || 'en',
                defaultCurrency: preferences.defaultCurrency || 'USD',
                defaultCategory: preferences.defaultCategory || 'General',
                autoCategorizationToggle: preferences.autoCategorizationToggle ?? true,
                taxCalculationToggle: preferences.taxCalculationToggle ?? false
            });
        }
    }, [preferences]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updatePreferences(formData);
    };

    return (
        <div>
            <div className="settings-header">
                <h2>Preferences</h2>
                <p>Customize your application experience</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="settings-section">
                    <h3>Appearance</h3>
                    <div className="card">
                        <div className="form-group">
                            <label className="form-label">Theme</label>
                            <select
                                className="form-select"
                                name="theme"
                                value={formData.theme}
                                onChange={handleChange}
                            >
                                <option value="LIGHT">Light</option>
                                <option value="DARK">Dark</option>
                                <option value="SYSTEM">System Default</option>
                            </select>
                            <p className="text-muted text-sm mt-2">
                                Choose how the application looks to you. System default will follow your OS settings.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <h3>Regional</h3>
                    <div className="card">
                        <div className="settings-grid two-col">
                            <div className="form-group">
                                <label className="form-label">Language</label>
                                <select
                                    className="form-select"
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                >
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Default Currency</label>
                                <select
                                    className="form-select"
                                    name="defaultCurrency"
                                    value={formData.defaultCurrency}
                                    onChange={handleChange}
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="NGN">NGN (₦)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Preferences;
