import React from 'react';

const EnseignantDashboard = () => {
  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Mes Cours</h2>
      <div style={{ background: 'var(--surface-light)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Bienvenue sur le tableau de bord enseignant. Vous retrouverez ici vos matières et vos listes d'étudiants.</p>
      </div>
    </div>
  );
};

export default EnseignantDashboard;
