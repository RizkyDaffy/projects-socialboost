import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OtpPage from './pages/OtpPage';
import DashboardPage from './pages/DashboardPage';
import EarnCoinsPage from './pages/EarnCoinsPage';
import MissionPage from './pages/MissionPage';
import ServicesPage from './pages/ServicesPage';
import BuyCoinsPage from './pages/BuyCoinsPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import BonusHarianPage from './pages/BonusHarianPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen transition-opacity duration-500">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/earn-coins" element={<EarnCoinsPage />} />
          <Route path="/mission" element={<MissionPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/buy-coins" element={<BuyCoinsPage />} />
          <Route path="/order-history" element={<OrderHistoryPage />} />
          <Route path="/daily-bonus" element={<BonusHarianPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
