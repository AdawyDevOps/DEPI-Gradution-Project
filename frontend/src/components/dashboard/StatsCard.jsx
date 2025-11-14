import React from 'react';

const StatsCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="stat-card">
      {icon && <div className="stat-icon">{icon}</div>}
      <h3>{title}</h3>
      <div className="value">{value}</div>
      <div className="subtitle">{subtitle}</div>
    </div>
  );
};

export default StatsCard;