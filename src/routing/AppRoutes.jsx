
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import MonthlySummary from '../pages/MonthlySummary';
import TransactionListPage from '../pages/TransactionListPage';
import Analytics from '../pages/Analytics';
import Profile from '../pages/Profile/Profile';
import Settings from '../pages/Settings/Settings';
// Added import

import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />

      <Route path="/dashboard" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="summary" element={<MonthlySummary />} />
        <Route path="transactions" element={<TransactionListPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} /> {/* Added route */}
      </Route>
      <Route path="/transactions" element={<MainLayout />}>
        <Route index element={<TransactionListPage />} />
      </Route>
      <Route path="/summary" element={<MainLayout />}>
        <Route index element={<MonthlySummary />} />
      </Route>
      <Route path="/analytics" element={<MainLayout />}>
        <Route index element={<Analytics />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;