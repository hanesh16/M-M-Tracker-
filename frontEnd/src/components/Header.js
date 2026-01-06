import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
  const navigate = useNavigate();

  const handlePrevious = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    localStorage.removeItem('det-auth');
    localStorage.removeItem('det-user');
    navigate('/');
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      paddingBottom: '20px',
      borderBottom: '2px solid #fbe2d9'
    }}>
      <button
        onClick={handlePrevious}
        style={{
          padding: '8px 16px',
          background: '#fff',
          color: '#DAA06D',
          border: '2px solid #DAA06D',
          borderRadius: '8px',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#fbe2d9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#fff';
        }}>
        ← Previous
      </button>

      <h1 style={{
        color: '#2f2b28',
        fontSize: '1.8rem',
        fontWeight: 'bold',
        margin: 0,
        textAlign: 'center',
        flex: 1
      }}>
        {title}
      </h1>

      <button
        onClick={handleLogout}
        style={{
          padding: '8px 16px',
          background: '#fff',
          color: '#c62828',
          border: '2px solid #c62828',
          borderRadius: '8px',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#ffebee';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#fff';
        }}>
        Logout
      </button>
    </div>
  );
};

export default Header;
