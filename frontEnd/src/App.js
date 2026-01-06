import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import VerifyEmail from './pages/VerifyEmail';
import DashboardPage from './pages/DashboardPage';
import AddExpense from './pages/AddExpense';
import AddIncome from './pages/AddIncome';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AboutUs from './pages/AboutUs';
import Help from './pages/Help';
import PrivacyPolicy from './pages/PrivacyPolicy';
import faviconImg from './images/pic6.png';

// Simple auth helper using JWT token
const isLoggedIn = () => localStorage.getItem('det-token') !== null;

const App = () => {
  useEffect(() => {
    const head = document.head;
    let link = head.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      head.appendChild(link);
    }
    link.href = faviconImg;
    link.sizes = '64x64';
  }, []);

  return (
    <div className="min-h-screen bg-cream text-slate-800">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/help" element={<Help />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route
          path="/dashboard"
          element={isLoggedIn() ? <DashboardPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/add-expense"
          element={isLoggedIn() ? <AddExpense /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/add-income"
          element={isLoggedIn() ? <AddIncome /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={isLoggedIn() ? <Profile /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/settings"
          element={isLoggedIn() ? <Settings /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
