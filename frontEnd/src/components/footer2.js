import React from 'react';
import { Link } from 'react-router-dom';

const Footer2 = () => {
  return (
    <footer style={{
      background: '#fefdfb',
      borderTop: '3px solid #c08b5c',
      padding: '25px 0 15px 0',
      marginTop: '60px',
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '100%', padding: '0 20px', margin: '0 auto' }}>
        {/* Main Footer Content */}
        <div style={{ marginBottom: '15px', maxWidth: '1200px', margin: '0 auto 15px auto' }}>
          <div className="row">
            {/* Left Section - Logo, Name, Tagline */}
            <div className="col-lg-4 col-md-5 mb-3 mb-lg-0">
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '12px' }}>
                {/* Image */}
                <div style={{ flexShrink: 0 }}>
                  <img src={require('../images/pic11.png')} alt="M&M Tracker" style={{ 
                    maxHeight: '90px', 
                    maxWidth: '100%', 
                    objectFit: 'contain' 
                  }} />
                </div>
                {/* Website Name & Tagline */}
                <div>
                  <h2 style={{
                    color: '#2f2b28',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    margin: '0 0 6px 0'
                  }}>
                    M&M Tracker
                  </h2>
                  <p style={{
                    color: '#8b8078',
                    fontSize: '0.8rem',
                    margin: 0,
                    fontStyle: 'italic',
                    lineHeight: '1.3'
                  }}>
                    Guided by Mocha & Milky to help you manage money better.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section - Links & Message */}
            <div className="col-lg-8 col-md-7" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {/* Footer Links */}
              <div style={{ textAlign: 'right', marginBottom: '12px' }}>
                <nav style={{ display: 'flex', justifyContent: 'flex-end', gap: '25px', flexWrap: 'wrap' }}>
                  <Link to="/profile" style={{
                    color: '#6b6359',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    transition: 'color 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#f6b7a0'}
                  onMouseLeave={(e) => e.target.style.color = '#6b6359'}
                  >
                    Profile
                  </Link>
                  <Link to="/add-expense" style={{
                    color: '#6b6359',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    transition: 'color 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#f6b7a0'}
                  onMouseLeave={(e) => e.target.style.color = '#6b6359'}
                  >
                    Add Expense
                  </Link>
                  <Link to="/add-income" style={{
                    color: '#6b6359',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    transition: 'color 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#f6b7a0'}
                  onMouseLeave={(e) => e.target.style.color = '#6b6359'}
                  >
                    Add Income
                  </Link>
                  <Link to="/settings" style={{
                    color: '#6b6359',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    transition: 'color 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#f6b7a0'}
                  onMouseLeave={(e) => e.target.style.color = '#6b6359'}
                  >
                    Settings
                  </Link>
                </nav>
              </div>

          </div>

          {/* Friendly Message - Full Width */}
          <div style={{
            textAlign: 'center',
            width: '100%',
            margin: '12px 0 0 0',
            padding: '12px',
            background: '#fffaf3',
            borderRadius: '8px',
            borderLeft: '3px solid #f6b7a0',
            borderRight: '3px solid #f6b7a0'
          }}>
            <p style={{
              color: '#6b6359',
              fontSize: '0.85rem',
              lineHeight: '1.4',
              margin: 0
            }}>
              Track your income, understand your spending, and grow your savings — one day at a time.
            </p>
          </div>
        </div>
        </div>

        {/* Copyright Line */}
        <div style={{
          borderTop: '1px solid #e8dcd0',
          paddingTop: '10px',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#9b8f84',
            fontSize: '0.8rem',
            margin: 0
          }}>
            © 2026 M&M Tracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer2;
