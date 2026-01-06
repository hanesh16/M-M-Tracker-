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
      <Link to="/" className="text-decoration-none" aria-label="M&M Tracker home">
        <span className="fw-bold" style={{ fontSize: '1.5rem' }}>
          <span style={{ color: '#DAA06D' }}>M</span>
          <span style={{ color: '#2f2b28' }}>&</span>
          <span style={{ color: '#f6b7a0' }}>M</span>
          <span style={{ color: '#2f2b28' }}> Tracker</span>
        </span>
      </Link>
      {showAuthButtons && (
        <div className="d-flex gap-2 align-items-center">
          <button type="button" className="btn login-btn px-3 py-2" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
