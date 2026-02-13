import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../../hooks/useSettings';
import Loading from '../../components/common/Loading';
import './Profile.css';

const Profile = () => {
    const { profile, updateProfile, loading, loadAllSettings } = useSettings();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        phoneNumber: '',
        profilePhotoUrl: '',
        countryCode: 'NG'
    });
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadAllSettings();
    }, [loadAllSettings]);

    useEffect(() => {
        if (profile) {
            setFormData({
                username: profile.username || '',
                email: profile.email || '',
                fullName: profile.fullName || '',
                phoneNumber: profile.phoneNumber || '',
                profilePhotoUrl: profile.profilePhotoUrl || '',
                countryCode: profile.countryCode || 'NG'
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

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size and type
            if (file.size > 2 * 1024 * 1024) {
                alert('File size too large. Max 2MB.');
                return;
            }
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                alert('Invalid file type. Only JPG, PNG, and WEBP are allowed.');
                return;
            }
            // Implementation for upload would go here (using the stub)
            alert('Avatar upload triggered (Stub implementation)');
        }
    };

    if (!profile) return <Loading />;

    const initials = profile.username ? profile.username.substring(0, 2).toUpperCase() : 'U';

    return (
        <div className="page-content container">
            <div className="profile-hero mb-6">
                <div className="profile-header-main">
                    <div className="avatar-section">
                        <div className="profile-avatar-large" onClick={handleAvatarClick}>
                            {formData.profilePhotoUrl ? (
                                <img src={formData.profilePhotoUrl} alt={formData.username} />
                            ) : (
                                <span>{initials}</span>
                            )}
                            <div className="avatar-overlay">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            accept="image/jpeg,image/png,image/webp"
                        />
                    </div>
                    <div className="profile-title-section">
                        <h1>{profile.fullName || profile.username}</h1>
                        <p className="text-muted">@{profile.username}</p>
                        <div className="status-badges">
                            <span className={`badge ${profile.verificationStatus === 'VERIFIED' ? 'badge-success' : 'badge-warning'}`}>
                                {profile.verificationStatus || 'UNVERIFIED'}
                            </span>
                            <span className="badge badge-info">
                                KYC: {profile.kycStatus || 'NONE'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-grid">
                <div className="profile-card main-info">
                    <h3>Personal Information</h3>
                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    disabled
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
                                    disabled={profile.verificationStatus === 'VERIFIED'}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
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
                                <label className="form-label">Country</label>
                                <select
                                    className="form-input"
                                    name="countryCode"
                                    value={formData.countryCode}
                                    onChange={handleChange}
                                >
                                    <option value="NG">Nigeria</option>
                                    <option value="US">United States</option>
                                    <option value="GB">United Kingdom</option>
                                    <option value="CA">Canada</option>
                                    <option value="DE">Germany</option>
                                </select>
                            </div>
                        </div>

                        <div className="profile-actions mt-6">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="profile-sidebar">
                    <div className="profile-card info-summary">
                        <h3>Account Summary</h3>
                        <div className="summary-list mt-4">
                            <div className="summary-item">
                                <span className="label">Member Since</span>
                                <span className="value">{new Date(profile.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="summary-item">
                                <span className="label">Last Updated</span>
                                <span className="value">{new Date(profile.updatedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="summary-item">
                                <span className="label">User ID</span>
                                <span className="value truncate">#{profile.id}</span>
                            </div>
                        </div>
                    </div>

                    <div className="profile-card verification-status">
                        <h3>KYC Verification</h3>
                        <p className="text-sm text-muted mt-2">
                            Complete your verification to increase your transaction limits and unlock premium features.
                        </p>
                        <button className="btn btn-outline btn-block mt-4" disabled>
                            Start Verification
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
