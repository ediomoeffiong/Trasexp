import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div>
      <nav>
        <div className="container nav-container">
          <div className="nav-logo">Trasexp</div>
          <ul className="nav-links">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/add" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Add Transaction
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/summary" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Monthly Summary
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <main className="container page-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;