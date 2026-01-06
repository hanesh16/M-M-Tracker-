import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../images/pic11.png';

const NavHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 900 : false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('det-token');
    navigate('/');
  };

  const isActive = (path) => (location.pathname === path ? '#DAA06D' : '#2f2b28');

  const navItems = [
    { path: '/dashboard', label: 'Home' },
    { path: '/profile', label: 'Profile' },
    { path: '/add-income', label: 'Add Income' },
    { path: '/add-expense', label: 'Add Expense' },
    { path: '/settings', label: 'Settings' }
  ];

  const renderNavButtons = (stacked = false) => (
    <div style={{
      display: 'flex',
      gap: stacked ? '14px' : '25px',
      alignItems: stacked ? 'stretch' : 'center',
      flexDirection: stacked ? 'column' : 'row',
      flexWrap: stacked ? 'nowrap' : 'wrap'
    }}>
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => {
            navigate(item.path);
            setMenuOpen(false);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: isActive(item.path),
            fontSize: '0.95rem',
            fontWeight: isActive(item.path) === '#DAA06D' ? '700' : '600',
            cursor: 'pointer',
            padding: stacked ? '6px 0' : '8px 0',
            borderBottom: isActive(item.path) === '#DAA06D' ? '3px solid #DAA06D' : 'none',
            transition: 'all 0.3s ease',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => {
            if (isActive(item.path) !== '#DAA06D') {
              e.currentTarget.style.color = '#DAA06D';
            }
          }}
          onMouseLeave={(e) => {
            if (isActive(item.path) !== '#DAA06D') {
              e.currentTarget.style.color = '#2f2b28';
            }
          }}
        >
          {item.label}
        </button>
      ))}
      <button
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          background: '#DAA06D',
          color: '#fff',
          border: '2px solid #DAA06D',
          borderRadius: '8px',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#DAA06D';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#DAA06D';
          e.currentTarget.style.color = '#fff';
        }}
      >
        Logout
      </button>
    </div>
  );

  return (
    <div style={{
      background: '#f8ece2',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      padding: '15px 30px',
      marginBottom: '30px',
      borderRadius: '0 0 16px 16px',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <img
            src={logo}
            alt="M&M Logo"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              objectFit: 'cover',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/dashboard')}
          />
          <h1
            style={{
              color: '#2f2b28',
              fontSize: '1.6rem',
              fontWeight: 'bold',
              margin: 0,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
            onClick={() => navigate('/dashboard')}
          >
            M&M Tracker
          </h1>
        </div>

        {isMobile ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                border: '2px solid #DAA06D',
                background: '#fff',
                color: '#2f2b28',
                fontSize: '1.2rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fbe2d9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
              }}
            >
              ☰
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            {renderNavButtons(false)}
          </div>
        )}
      </div>

      {isMobile && menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(47, 43, 40, 0.25)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              zIndex: 8
            }}
          />
          <div style={{
            position: 'absolute',
            right: '20px',
            top: '100%',
            marginTop: '12px',
            width: '260px',
            background: '#fff',
            border: '1px solid #fbe2d9',
            boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
            borderRadius: '12px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 9
          }}>
            {renderNavButtons(true)}
          </div>
        </>
      )}
    </div>
  );
};

export default NavHeader;
