import React from 'react';
import NavBar from '../components/NavBar';
import InfoCard from '../components/InfoCard';
import Character from '../components/Character';

const DashboardPage = () => {
  return (
    <div>
      <NavBar showAuthButtons />
      <div className="container section-padding pt-3">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <p className="mb-1 text-uppercase" style={{ color: '#c08b5c', letterSpacing: 1 }}>
              Overview
            </p>
            <h2 className="fw-bold mb-0">Your wallet snapshot</h2>
            <small className="text-muted">Replace placeholders with real data later.</small>
          </div>
          <Character type="mocha" size={110} waving />
        </div>

        <div className="card-grid mb-4">
          <InfoCard title="Income" value="$2,400" note="This month" />
          <InfoCard title="Expenses" value="$1,280" note="This month" />
          <InfoCard title="Savings" value="$1,120" note="Leftover" />
        </div>

        <div className="card-soft rounded-4 p-4">
          <h5 className="fw-semibold mb-2">Quick actions</h5>
          <p className="text-muted mb-3">Imagine a form here to add income or expenses.</p>
          <div className="d-flex gap-2 flex-wrap">
            <button className="btn mocha-btn">Add expense</button>
            <button className="btn btn-outline-secondary">Add income</button>
            <button className="btn btn-outline-secondary">View summary</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
