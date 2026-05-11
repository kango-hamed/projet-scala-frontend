import React from 'react';

const StatusBadge = ({ status }) => {
  let type = 'up'; 
  const s = status.toLowerCase();
  
  if (s.includes('suspendu') || s.includes('annulé') || s.includes('ajourné') || s.includes('absent') || s.includes('retard')) {
    type = 'down';
  } 
  else if (s.includes('attente') || s.includes('redoublement')) {
    type = 'warning';
  }
  else if (s.includes('jour') || s.includes('valid')) {
    type = 'up';
  }

  if (type === 'up') {
    return <span className="flup-badge flup-badge--up">{status}</span>;
  }
  
  if (type === 'down') {
    return <span className="flup-badge flup-badge--down">{status}</span>;
  }
  
  return (
    <span className="flup-badge" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
      {status}
    </span>
  );
};

export default StatusBadge;
