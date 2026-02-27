import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Icons
const LayoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
);

const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
);

const MonetraqLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-icon">
    <rect width="32" height="32" rx="8" fill="url(#logo-gradient)" />
    <path d="M8 22V10L16 18L24 10V22" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 22H20" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    <defs>
      <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B82F6" />
        <stop offset="1" stopColor="#2563EB" />
      </linearGradient>
    </defs>
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
);

import ProfileDropdown from '../components/common/ProfileDropdown';
import MobileProfileMenu from '../components/common/MobileProfileMenu';
import AccountSwitcher from '../components/common/AccountSwitcher';

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // lock scroll when mobile menu is open
  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => document.body.classList.remove('menu-open');
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setTimeout(() => setShowProfileMenu(false), 300);
  };

  const handleMobileProfileClick = () => {
    setShowProfileMenu(true);
  };

  return (
    <div>
      <nav className={`navbar ${isMenuOpen ? 'menu-open' : ''}`}>
        <div className="container nav-content">
          {/* Left: Logo & Account Switcher */}
          <div className="nav-left">
            <Link to="/" className="nav-logo-container">
              <MonetraqLogo />
              <span className="nav-logo-text">Monetraq</span>
            </Link>
            <AccountSwitcher />
          </div>

          {/* Center: Navigation Links */}
          <div className={`nav-center ${isMenuOpen ? 'mobile-open' : ''}`}>
            <div className="container">
              <ul className="nav-links">
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  end
                  onClick={closeMenu}
                >
                  <LayoutIcon />
                  <span>Dashboard</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/transactions"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <ListIcon />
                  <span>Transactions</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/summary"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <ChartIcon />
                  <span>Summary</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/analytics"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>
                  <span>Analytics</span>
                </NavLink>
              </li>
              </ul>
            </div>
          </div>

          {/* Right: User Section */}
          <div className="nav-right">
            <ProfileDropdown />

            <button
              className="mobile-menu-btn"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
            </button>
          </div>

          {/* Add a specific mobile profile triggers or menu items if needed */}

          <MobileProfileMenu
            isOpen={showProfileMenu}
            onBack={() => setShowProfileMenu(false)}
            onClose={closeMenu}
          />
        </div>
      </nav>
      <main className="container page-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;