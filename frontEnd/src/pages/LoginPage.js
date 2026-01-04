import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  useEffect(() => {
    const root = document.documentElement;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyHeight = document.body.style.height;
    const prevBodyMargin = document.body.style.margin;
    const prevRootOverflow = root.style.overflow;
    const prevRootHeight = root.style.height;
    const prevRootMargin = root.style.margin;

    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.margin = '0';
    root.style.overflow = 'hidden';
    root.style.height = '100%';
    root.style.margin = '0';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.height = prevBodyHeight;
      document.body.style.margin = prevBodyMargin;
      root.style.overflow = prevRootOverflow;
      root.style.height = prevRootHeight;
      root.style.margin = prevRootMargin;
    };
  }, []);

  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const saved = localStorage.getItem('det-user');
    if (!saved) {
      setError('No user found. Please sign up first.');
      return;
    }

    const user = JSON.parse(saved);
    const matches = user.email === form.email && user.password === form.password;

    if (!matches) {
      setError('Email or password is incorrect.');
      return;
    }

    localStorage.setItem('det-auth', 'true');
    navigate('/dashboard');
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        padding: '24px 16px',
        boxSizing: 'border-box',
        margin: 0
      }}
    >
      <div className="card-soft rounded-4 p-4 p-md-5 login-card" style={{ maxWidth: 460, width: '100%' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="fw-bold mb-1">Welcome back</h2>
            <p className="text-muted mb-0">Milky saved your place.</p>
          </div>
          <div
            style={{
              width: 140,
              height: 140,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src={require('../images/pic9.png')}
              alt="Mocha"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>

        {error && <div className="alert alert-warning py-2">{error}</div>}

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-12">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
          </div>
          <div className="col-12">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
          </div>
          <div className="col-12 d-grid">
            <button type="submit" className="btn mocha-btn py-2 fw-semibold">Login</button>
          </div>
        </form>

        <p className="mt-3 text-center mb-0">
          New here? <Link to="/signup" className="signup-link">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
