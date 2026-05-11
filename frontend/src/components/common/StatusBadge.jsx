import React from 'react';
import './Common.css';

const StatusBadge = ({ status }) => {
  let colorClass = 'badge-default';
  
  const normalizedStatus = status.toLowerCase();
  
  if (['actif', 'validée', 'soldé', 'admis', 'justifiée'].includes(normalizedStatus)) {
    colorClass = 'badge-success';
  } else if (['suspendu', 'annulée', 'impayé', 'ajourné', 'non justifiée'].includes(normalizedStatus)) {
    colorClass = 'badge-danger';
  } else if (['en attente', 'partiel', 'redoublement'].includes(normalizedStatus)) {
    colorClass = 'badge-warning';
  }

  return (
    <span className={`status-badge ${colorClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
