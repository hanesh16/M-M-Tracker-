import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import NavHeader from '../components/NavHeader';
import Footer2 from '../components/footer2';

import { API_BASE_URL } from '../utils/api';

const Settings = () => {
  const navigate = useNavigate();
  const { currency: contextCurrency, setCurrency: setContextCurrency } = useCurrency();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [savedMessage, setSavedMessage] = useState(false);
  const [clearDataLoading, setClearDataLoading] = useState(false);
  // const API_BASE_URL = 'http://localhost:8000'; (Moved to utils)
  const token = typeof window !== 'undefined' ? localStorage.getItem('det-token') : null;

  useEffect(() => {
    // Load UI-only settings from localStorage
    const storedSettings = JSON.parse(localStorage.getItem('det-settings') || '{}');
    if (typeof storedSettings.notifications === 'boolean') setNotifications(storedSettings.notifications);
    if (typeof storedSettings.darkMode === 'boolean') setDarkMode(storedSettings.darkMode);

    // Load currency from context (already loaded on app start)
    setCurrency(contextCurrency);
  }, [contextCurrency]);

  const handleSaveSettings = async () => {
    // Save UI-only settings locally
    const uiSettings = { notifications, darkMode };
    localStorage.setItem('det-settings', JSON.stringify(uiSettings));

    // Persist currency to backend
    try {
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/settings/?token=${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency, usd_to_inr_rate: 81.0 })
      });

      if (res.ok) {
        // Update context with new currency
        setContextCurrency(currency);

        // Refresh dashboard and data by reloading page
        // This ensures all components re-fetch data in new currency
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
      }
    } catch (err) {
      console.warn('Settings save (backend) failed.', err);
    } finally {
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all expense, income, and saving plan data? This cannot be undone.')) {
      setClearDataLoading(true);
      try {
        if (!token) {
          alert('Not authenticated');
          return;
        }
        const res = await fetch(`${API_BASE_URL}/auth/data?token=${token}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          alert('All user data has been cleared successfully!');
          // Refresh dashboard
          window.location.href = '/dashboard';
        } else {
          alert('Failed to clear data. Please try again.');
        }
      } catch (err) {
        console.error('Clear data error:', err);
        alert('Error clearing data. Please try again.');
      } finally {
        setClearDataLoading(false);
      }
    }
  };

  return (
    <>
      <NavHeader />

      <div style={{
        background: 'linear-gradient(135deg, #d8e9f3 0%, #f0f5f8 50%, #fdf8f1 100%)',
        minHeight: 'calc(100vh - 80px)',
        padding: '40px 20px 60px 20px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          {/* Page Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{
              color: '#2f2b28',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              Settings
            </h1>
            <p style={{
              color: '#6b6359',
              fontSize: '1rem',
              margin: 0
            }}>
              Customize your M&M Tracker experience
            </p>
          </div>

          {savedMessage && (
            <div style={{
              background: '#c8e6c9',
              color: '#2e7d32',
              padding: '12px 20px',
              borderRadius: '10px',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '0.95rem',
              fontWeight: '600'
            }}>
              ✓ Settings saved successfully!
            </div>
          )}

          {/* General Settings */}
          <div style={{
            background: '#fffbf0',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
            marginBottom: '25px'
          }}>
            <h2 style={{
              color: '#2f2b28',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '25px'
            }}>
              General Settings
            </h2>

            {/* Notifications Toggle */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px',
              paddingBottom: '25px',
              borderBottom: '1px solid #e8dcd0'
            }}>
              <div>
                <p style={{
                  color: '#2f2b28',
                  fontSize: '1rem',
                  fontWeight: '600',
                  margin: '0 0 5px 0'
                }}>
                  Notifications
                </p>
                <p style={{
                  color: '#9b8f84',
                  fontSize: '0.85rem',
                  margin: 0
                }}>
                  Get notified about expenses and income updates
                </p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                style={{
                  width: '60px',
                  height: '30px',
                  borderRadius: '15px',
                  background: notifications ? '#DAA06D' : '#e0d5c7',
                  border: 'none',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: '3px',
                  left: notifications ? '33px' : '3px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}></div>
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px',
              paddingBottom: '25px',
              borderBottom: '1px solid #e8dcd0'
            }}>
              <div>
                <p style={{
                  color: '#2f2b28',
                  fontSize: '1rem',
                  fontWeight: '600',
                  margin: '0 0 5px 0'
                }}>
                  Dark Mode
                </p>
                <p style={{
                  color: '#9b8f84',
                  fontSize: '0.85rem',
                  margin: 0
                }}>
                  Switch to dark theme (Coming soon)
                </p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                disabled
                style={{
                  width: '60px',
                  height: '30px',
                  borderRadius: '15px',
                  background: darkMode ? '#DAA06D' : '#e0d5c7',
                  border: 'none',
                  position: 'relative',
                  cursor: 'not-allowed',
                  opacity: 0.5,
                  transition: 'all 0.3s ease'
                }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: '3px',
                  left: darkMode ? '33px' : '3px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}></div>
              </button>
            </div>

            {/* Currency Selection */}
            <div style={{ marginBottom: '0' }}>
              <label style={{
                display: 'block',
                color: '#2f2b28',
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '10px'
              }}>
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #f6b7a0',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  color: '#2f2b28',
                  background: '#fff',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}>
                <option value="USD">USD - US Dollar ($)</option>
                <option value="INR">INR - Indian Rupee (₹)</option>
              </select>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveSettings}
            style={{
              width: '100%',
              padding: '15px',
              background: '#DAA06D',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(218, 160, 109, 0.3)',
              marginBottom: '25px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#c89052';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#DAA06D';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
            Save Settings
          </button>

          {/* Data Management */}
          <div style={{
            background: '#fffbf0',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
            marginBottom: '25px'
          }}>
            <h2 style={{
              color: '#2f2b28',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '15px'
            }}>
              Data Management
            </h2>
            <p style={{
              color: '#9b8f84',
              fontSize: '0.9rem',
              marginBottom: '20px',
              lineHeight: '1.5'
            }}>
              Clear all your expense and income data. This action cannot be undone.
            </p>
            <button
              onClick={handleClearData}
              disabled={clearDataLoading}
              style={{
                width: '100%',
                padding: '12px',
                background: '#fff',
                color: '#c62828',
                border: '2px solid #c62828',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: clearDataLoading ? 'wait' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: clearDataLoading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!clearDataLoading) e.currentTarget.style.background = '#ffebee';
              }}
              onMouseLeave={(e) => {
                if (!clearDataLoading) e.currentTarget.style.background = '#fff';
              }}>
              {clearDataLoading ? 'Clearing...' : 'Clear All Data'}
            </button>
          </div>

          {/* Quick Links */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '15px'
          }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: '#fffbf0',
                border: '2px solid #f6b7a0',
                borderRadius: '12px',
                padding: '15px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <p style={{
                color: '#DAA06D',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                Dashboard
              </p>
            </button>

            <button
              onClick={() => navigate('/profile')}
              style={{
                background: '#fffbf0',
                border: '2px solid #f6b7a0',
                borderRadius: '12px',
                padding: '15px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <p style={{
                color: '#DAA06D',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                Profile
              </p>
            </button>
          </div>

        </div>
      </div>

      <Footer2 />
    </>
  );
};

export default Settings;
