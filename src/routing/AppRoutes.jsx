import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import AddTransaction from '../pages/AddTransaction';
import MonthlySummary from '../pages/MonthlySummary';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="add" element={<AddTransaction />} />
        <Route path="summary" element={<MonthlySummary />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;