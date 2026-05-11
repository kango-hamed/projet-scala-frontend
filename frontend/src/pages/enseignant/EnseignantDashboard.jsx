import React from 'react';

const EnseignantDashboard = () => {
  return (
    <div>
      <h1 className="flup-h1" style={{ marginBottom: '24px' }}>Mes Cours</h1>
      <div className="flup-card">
        <p style={{ color: 'var(--flup-text-secondary)', margin: 0, fontWeight: 500 }}>
          Bienvenue sur le tableau de bord enseignant. Vous retrouverez ici vos matières et vos listes d'étudiants.
        </p>
      </div>
    </div>
  );
};

export default EnseignantDashboard;
