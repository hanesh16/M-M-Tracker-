import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = ({ showAuthButtons = false }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem('det-auth', 'false');
    navigate('/');
  };

  return (
    <nav className="navbar nav-cream mb-4 px-4 py-3 d-flex justify-content-between align-items-center">
      <Link to="/" className="text-decoration-none" aria-label="Daily Expense Tracker home">
        <span className="fw-bold" style={{ color: '#c08b5c' }}>
          Daily Expense Tracker
        </span>
      </Link>
      {showAuthButtons && (
        <div className="d-flex gap-2 align-items-center">
          <Link to="/login" className="btn btn-sm mocha-btn px-3 py-2">
            Login
          </Link>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
