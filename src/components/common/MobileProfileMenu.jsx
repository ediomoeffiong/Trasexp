import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../hooks/useSettings';
import './MobileProfileMenu.css';

// Using SVG icons directly for better performance and consistency
const BackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);

const CameraIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
);

const MobileProfileMenu = ({ isOpen, onBack, onClose }) => {
    const { user, logout } = useAuth();
    const { updateProfile } = useSettings();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Default avatar if user doesn't have one
    const defaultAvatar = "https://ui-avatars.com/api/?name=" + (user?.fullName || user?.username || 'User') + "&background=0D8ABC&color=fff";
    const profileImage = user?.profilePhotoUrl || user?.profilePhoto || defaultAvatar;

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                // Triggering file input click implies user wants to change it.
                console.log("File selected:", file.name);
            } catch (error) {
                console.error("Failed to upload avatar", error);
            }
        }
    };

    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };

    const handleLogout = () => {
        logout();
        onClose();
        navigate('/auth/login');
    };

    return (
        <div className={`mobile-profile-menu ${isOpen ? 'open' : ''}`}>
            <div className="mpm-header">
                <button className="mpm-back-btn" onClick={onBack}>
                    <BackIcon />
                    <span>Back</span>
                </button>
                <span className="mpm-title">Profile</span>
            </div>

            <div className="mpm-content">
                <div className="mpm-avatar-section">
                    <div className="mpm-avatar-wrapper">
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="mpm-avatar"
                        />
                        <button
                            className="mpm-camera-btn"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <CameraIcon />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="mpm-user-info">
                        <h3>{user?.fullName || user?.username || 'User Name'}</h3>
                        <p>{user?.email || 'user@example.com'}</p>
                    </div>
                </div>

                <div className="mpm-links">
                    <button onClick={() => handleNavigation('/settings')} className="mpm-link-item">
                        <span>Account Settings</span>
                    </button>
                    <button onClick={() => handleNavigation('/settings')} className="mpm-link-item">
                        <span>Security</span>
                    </button>
                    <button onClick={() => handleNavigation('/settings')} className="mpm-link-item">
                        <span>Notifications</span>
                    </button>
                    <div className="mpm-divider"></div>
                    <button onClick={handleLogout} className="mpm-link-item text-danger">
                        <span>Log Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileProfileMenu;
