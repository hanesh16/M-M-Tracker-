import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', category: 'Select one', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.phone || !form.category || form.category === 'Select one' || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords must match.');
      return;
    }

    const defaultCurrency = form.category === 'Milky' ? 'INR' : 'USD';

    // Persist user to localStorage for demo only
    localStorage.setItem('det-user', JSON.stringify({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      category: form.category,
      joinDate: new Date().toISOString().slice(0, 10)
    }));

    const existingSettings = JSON.parse(localStorage.getItem('det-settings') || '{}');
    localStorage.setItem('det-settings', JSON.stringify({
      ...existingSettings,
      currency: defaultCurrency
    }));

    localStorage.setItem('det-auth', 'false');
    navigate('/login');
  };

  return (
    <div
      className="section-padding d-flex justify-content-center align-items-center"
      style={{ background: '#fef7f5', minHeight: '100vh' }}
    >
      <div
        className="card-soft rounded-4 p-4 p-md-5 signup-card"
        style={{ maxWidth: 520, width: '100%', background: '#fdf0ec' }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="fw-bold mb-1">Create account</h2>
            <p className="text-muted mb-0">Mocha will keep things tidy.</p>
          </div>
          <div
            style={{
              width: 150,
              height: 150,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src={require('../images/pic10.png')}
              alt="Signup character"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>

        {error && <div className="alert alert-warning py-2">{error}</div>}

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-12">
            <label className="form-label">Name</label>
            <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
          </div>
          <div className="col-12">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
          </div>
          <div className="col-12">
            <label className="form-label">Phone Number</label>
            <input name="phone" className="form-control" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="col-12">
            <label className="form-label">Category</label>
            <select name="category" className="form-control" value={form.category} onChange={handleChange} required>
              <option value="Select one">Select one</option>
              <option value="Mocha">Mocha</option>
              <option value="Milky">Milky</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Confirm Password</label>
            <input type="password" name="confirmPassword" className="form-control" value={form.confirmPassword} onChange={handleChange} required />
          </div>
          <div className="col-12 d-grid">
            <button
              type="submit"
              className="btn py-2 fw-semibold signup-save-btn"
            >
              Save
            </button>
          </div>
        </form>

        <p className="mt-3 text-center mb-0">
          Already have an account? <Link to="/login" className="login-link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
