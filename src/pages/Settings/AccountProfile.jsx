import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import Loading from '../../components/common/Loading';

const AccountProfile = () => {
    const { profile, updateProfile, loading } = useSettings();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        profilePhotoUrl: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                username: profile.username || '',
                email: profile.email || '',
                phoneNumber: profile.phoneNumber || '',
                profilePhotoUrl: profile.profilePhotoUrl || ''
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateProfile(formData);
    };

    return (
        <div>
            <div className="settings-header">
                <h2>Account Profile</h2>
                <p>Manage your personal information and contact details</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="settings-section">
                    <div className="settings-grid two-col">
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-input"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                className="form-input"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Profile Photo URL</label>
                            <input
                                type="url"
                                className="form-input"
                                name="profilePhotoUrl"
                                value={formData.profilePhotoUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/photo.jpg"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">User ID (Read Only)</label>
                    <input
                        type="text"
                        className="form-input"
                        value={profile?.id || ''}
                        disabled
                        style={{ backgroundColor: 'var(--bg-input)', opacity: 0.7 }}
                    />
                </div>

                <div className="settings-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AccountProfile;
