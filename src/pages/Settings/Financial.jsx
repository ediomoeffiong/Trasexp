import React, { useEffect, useState } from 'react';
import { useSettings } from '../../hooks/useSettings';

const Financial = () => {
    const { preferences, updatePreferences, loading } = useSettings();
    const [formData, setFormData] = useState({
        defaultCategory: 'General',
        autoCategorizationToggle: true,
        taxCalculationToggle: false
    });

    useEffect(() => {
        if (preferences) {
            setFormData({
                defaultCategory: preferences.defaultCategory || 'General',
                autoCategorizationToggle: preferences.autoCategorizationToggle ?? true,
                taxCalculationToggle: preferences.taxCalculationToggle ?? false
            });
        }
    }, [preferences]);

    const handleToggle = (key) => {
        const newData = { ...formData, [key]: !formData[key] };
        setFormData(newData);
        updatePreferences(newData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newData = { ...formData, [name]: value };
        setFormData(newData);
        updatePreferences(newData);
    };

    return (
        <div>
            <div className="settings-header">
                <h2>Financial Settings</h2>
                <p>Manage how your transactions and taxes are handled</p>
            </div>

            <div className="settings-section">
                <h3>Categorization</h3>
                <div className="card">
                    <div className="form-group mb-4">
                        <label className="form-label">Default Transaction Category</label>
                        <select
                            className="form-select"
                            name="defaultCategory"
                            value={formData.defaultCategory}
                            onChange={handleChange}
                        >
                            <option value="General">General</option>
                            <option value="Food">Food & Dining</option>
                            <option value="Transport">Transportation</option>
                            <option value="Bills">Bills & Utilities</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Investment">Investment</option>
                        </select>
                        <p className="text-muted text-sm mt-2">New transactions will be assigned this category by default.</p>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Auto-Categorization</h4>
                            <p>Automatically categorize transactions based on merchant names and history</p>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={formData.autoCategorizationToggle}
                                onChange={() => handleToggle('autoCategorizationToggle')}
                                disabled={loading}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="settings-section">
                <h3>Tax Preferences</h3>
                <div className="card">
                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Tax Calculation Toggle</h4>
                            <p>Enable automatic VAT/Sales Tax estimates on eligible transactions</p>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={formData.taxCalculationToggle}
                                onChange={() => handleToggle('taxCalculationToggle')}
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

export default Financial;
