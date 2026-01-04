import React from 'react';

const InfoCard = ({ title, value, note }) => {
  return (
    <div className="card-soft rounded-4 p-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0" style={{ color: '#c08b5c' }}>
          {title}
        </h5>
        <span className="badge" style={{ background: '#d8e9f3', color: '#2f2b28' }}>
          {note || 'placeholder'}
        </span>
      </div>
      <p className="fs-3 fw-bold mb-1">{value}</p>
      <small className="text-muted">Update this with real data later.</small>
    </div>
  );
};

export default InfoCard;
