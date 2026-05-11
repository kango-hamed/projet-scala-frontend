import React from 'react';
import './Common.css';

const KPICard = ({ title, value, icon, trend, color = 'var(--primary-color)' }) => {
  return (
    <div className="kpi-card">
      <div className="kpi-icon" style={{ backgroundColor: `${color}15`, color: color }}>
        {icon}
      </div>
      <div className="kpi-content">
        <h3>{title}</h3>
        <p className="kpi-value">{value}</p>
        {trend !== undefined && (
          <p className={`kpi-trend ${trend > 0 ? 'positive' : 'negative'}`}>
            {trend > 0 ? '+' : ''}{trend}% depuis le mois dernier
          </p>
        )}
      </div>
    </div>
  );
};

export default KPICard;
