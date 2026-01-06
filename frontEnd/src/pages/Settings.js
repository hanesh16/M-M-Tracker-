import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavHeader from '../components/NavHeader';
import Footer2 from '../components/footer2';

const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    const storedSettings = JSON.parse(localStorage.getItem('det-settings') || '{}');
    const storedUser = JSON.parse(localStorage.getItem('det-user') || '{}');
    const preferredCurrency = storedSettings.currency
      || (storedUser.category === 'Milky' ? 'INR' : 'USD');

    if (typeof storedSettings.notifications === 'boolean') {
      setNotifications(storedSettings.notifications);
    }
    if (typeof storedSettings.darkMode === 'boolean') {
      setDarkMode(storedSettings.darkMode);
    }
    setCurrency(preferredCurrency);
  }, []);

  const handleSaveSettings = () => {
    // Save settings to localStorage
    const settings = {
      notifications,
      darkMode,
      currency
    };
    localStorage.setItem('det-settings', JSON.stringify(settings));
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all expense and income data? This cannot be undone.')) {
      localStorage.removeItem('det-expenses');
      localStorage.removeItem('det-all-expenses');
      localStorage.removeItem('det-all-incomes');
      alert('All data has been cleared successfully!');
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
                <option value="EUR">EUR - Euro (€)</option>
                <option value="GBP">GBP - British Pound (£)</option>
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
              style={{
                width: '100%',
                padding: '12px',
                background: '#fff',
                color: '#c62828',
                border: '2px solid #c62828',
                borderRadius: '10px',
                fontSize: '0.95rem',
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
              Clear All Data
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
