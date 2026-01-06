import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [tokenInput, setTokenInput] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyWithToken(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyWithToken = async (verificationToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify?token=${verificationToken}`);
      const data = await response.json();

      if (response.ok) {
        setMessage('Email verified successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.detail || 'Verification failed');
      }
    } catch (err) {
      setError('Network error. Make sure backend is running.');
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualVerify = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!tokenInput) {
      setError('Please enter a token');
      setLoading(false);
      return;
    }

    await verifyWithToken(tokenInput);
  };

  return (
    <div
      className="section-padding d-flex justify-content-center align-items-center"
      style={{ background: '#fef7f5', minHeight: '100vh' }}
    >
      <div
        className="card-soft rounded-4 p-4 p-md-5"
        style={{ maxWidth: 520, width: '100%', background: '#fdf0ec' }}
      >
        <h2 className="fw-bold mb-3">Verify Your Email</h2>

        {loading && <p className="text-muted">Verifying...</p>}

        {message && (
          <div className="alert alert-success py-2 mb-3">{message}</div>
        )}

        {error && (
          <div className="alert alert-danger py-2 mb-3">{error}</div>
        )}

        {!token && !loading && (
          <>
            <p className="text-muted mb-3">
              Check the console output or your terminal where the backend is running for the verification token. Copy it below:
            </p>
            <form onSubmit={handleManualVerify} className="row g-3">
              <div className="col-12">
                <label className="form-label">Verification Token</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Paste the verification token here..."
                  required
                ></textarea>
              </div>
              <div className="col-12 d-grid">
                <button
                  type="submit"
                  className="btn py-2 fw-semibold"
                  style={{
                    background: '#DAA06D',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify Email'}
                </button>
              </div>
            </form>
          </>
        )}

        <p className="mt-3 text-center mb-0">
          Already verified? <a href="/login" className="login-link">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
