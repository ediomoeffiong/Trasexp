import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import AddTransaction from '../pages/AddTransaction';
import MonthlySummary from '../pages/MonthlySummary';

import LandingPage from '../pages/LandingPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="add" element={<AddTransaction />} />
        <Route path="summary" element={<MonthlySummary />} />
      </Route>
      {/* Redirect legacy adds or other routes if necessary, or just keep above structure */}
      <Route path="/add" element={<MainLayout />}>
        <Route index element={<AddTransaction />} />
      </Route>
      <Route path="/summary" element={<MainLayout />}>
        <Route index element={<MonthlySummary />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;