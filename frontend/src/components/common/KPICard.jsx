import React from 'react';

const KPICard = ({ title, value, icon, color }) => {
  return (
    <div className="flup-card flup-card--kpi" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--flup-text-muted)' }}>
        <div style={{ color: color || 'var(--flup-text-muted)', display: 'flex', alignItems: 'center' }}>
          {icon}
        </div>
        <span className="flup-label">{title}</span>
      </div>
      <div>
        <span className="flup-mono" style={{ fontSize: '22px', fontWeight: 700, color: 'var(--flup-text-primary)', letterSpacing: '-0.5px' }}>
          {value}
        </span>
      </div>
    </div>
  );
};

export default KPICard;
