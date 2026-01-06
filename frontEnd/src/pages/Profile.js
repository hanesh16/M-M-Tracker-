import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavHeader from '../components/NavHeader';
import Footer2 from '../components/footer2';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    joinDate: '',
    profileImage: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [savedMessage, setSavedMessage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const user = localStorage.getItem('det-user');
    if (user) {
      const parsed = JSON.parse(user);
      setUserData({
        name: parsed.name || 'User',
        email: parsed.email || 'user@example.com',
        joinDate: parsed.joinDate || '2026-01-01',
        profileImage: parsed.profileImage || ''
      });
      setEditedName(parsed.name || 'User');
    }
  }, []);



  const handleSave = () => {
    const user = JSON.parse(localStorage.getItem('det-user') || '{}');
    user.name = editedName;
    user.profileImage = userData.profileImage;
    localStorage.setItem('det-user', JSON.stringify(user));
    setUserData({ ...userData, name: editedName });
    setIsEditing(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleCancel = () => {
    setEditedName(userData.name);
    setIsEditing(false);
  };

  const handleChoosePhoto = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setUserData((prev) => {
        const updated = { ...prev, profileImage: base64 };
        const stored = JSON.parse(localStorage.getItem('det-user') || '{}');
        stored.profileImage = base64;
        stored.name = stored.name || prev.name;
        stored.email = stored.email || prev.email;
        stored.joinDate = stored.joinDate || prev.joinDate;
        localStorage.setItem('det-user', JSON.stringify(stored));
        return updated;
      });
    };
    reader.readAsDataURL(file);
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
              Profile
            </h1>
            <p style={{
              color: '#6b6359',
              fontSize: '1rem',
              margin: 0
            }}>
              Manage your account information
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
              ✓ Profile updated successfully!
            </div>
          )}

          {/* Profile Card */}
          <div style={{
            background: '#fffbf0',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
            marginBottom: '30px'
          }}>
            {/* Profile Icon */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #DAA06D 0%, #f6b7a0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px auto',
                boxShadow: '0 4px 12px rgba(218, 160, 109, 0.3)',
                overflow: 'hidden'
              }}>
                {userData.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{
                    fontSize: '3.4rem',
                    color: '#fff',
                    fontWeight: 'bold'
                  }}>
                    {userData.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <button
                  onClick={handleChoosePhoto}
                  style={{
                    padding: '8px 18px',
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
                    e.currentTarget.style.background = '#f0d9c4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fff';
                  }}
                >
                  Change Photo
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            {/* Name Section */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                color: '#6b6359',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Full Name
              </label>
              {!isEditing ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{
                    color: '#2f2b28',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    margin: 0
                  }}>
                    {userData.name}
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      padding: '8px 20px',
                      background: '#fff',
                      color: '#DAA06D',
                      border: '2px solid #DAA06D',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f0d9c4';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                    }}>
                    Edit
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid #f6b7a0',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      color: '#2f2b28',
                      background: '#fff',
                      boxSizing: 'border-box',
                      marginBottom: '15px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={handleSave}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#DAA06D',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#c89052';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#DAA06D';
                      }}>
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#fff',
                        color: '#2f2b28',
                        border: '2px solid #e0d5c7',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f5f1ed';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                      }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Email Section */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                color: '#6b6359',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Email Address
              </label>
              <p style={{
                color: '#2f2b28',
                fontSize: '1.2rem',
                margin: 0
              }}>
                {userData.email}
              </p>
            </div>

            {/* Join Date Section */}
            <div style={{ marginBottom: '0' }}>
              <label style={{
                display: 'block',
                color: '#6b6359',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Member Since
              </label>
              <p style={{
                color: '#2f2b28',
                fontSize: '1.2rem',
                margin: 0
              }}>
                {new Date(userData.joinDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: '#fffbf0',
                border: '2px solid #f6b7a0',
                borderRadius: '15px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <p style={{
                color: '#DAA06D',
                fontSize: '1rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                Go to Dashboard
              </p>
            </button>

            <button
              onClick={() => navigate('/settings')}
              style={{
                background: '#fffbf0',
                border: '2px solid #f6b7a0',
                borderRadius: '15px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <p style={{
                color: '#DAA06D',
                fontSize: '1rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                Settings
              </p>
            </button>
          </div>

        </div>
      </div>

      <Footer2 />
    </>
  );
};

export default Profile;
