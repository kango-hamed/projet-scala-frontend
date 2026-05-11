import React from 'react';
import { Users, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MesCours = () => {
  const navigate = useNavigate();

  const cours = [
    { id: 1, nom: 'Algorithmique & Prog C', niveau: 'Licence 1 Informatique', etudiants: 45, volume: '24h', color: 'var(--flup-data-1)' },
    { id: 2, nom: 'Bases de Données (SQL)', niveau: 'Licence 2 Informatique', etudiants: 38, volume: '20h', color: 'var(--flup-data-5)' },
    { id: 3, nom: 'Mathématiques Appliquées', niveau: 'Master 1', etudiants: 22, volume: '18h', color: 'var(--flup-data-3)' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="flup-h1">Mes Cours</h1>
          <p className="flup-label" style={{ marginTop: '8px' }}>Gérez vos matières et accédez rapidement à vos classes.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {cours.map(c => (
          <div key={c.id} className="flup-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: c.color }}></div>
                <h3 className="flup-h2" style={{ margin: 0, fontSize: '18px' }}>{c.nom}</h3>
              </div>
              <span className="flup-badge" style={{ background: 'var(--flup-bg)', color: 'var(--flup-text-secondary)', marginBottom: '24px', display: 'inline-block' }}>{c.niveau}</span>
              
              <div style={{ display: 'flex', gap: '32px', marginBottom: '32px', padding: '16px', background: 'var(--flup-bg)', borderRadius: '10px', border: '1px solid var(--flup-border)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--flup-text-muted)' }}>
                    <Users size={14} /> <span className="flup-label">Inscrits</span>
                  </div>
                  <span className="flup-mono" style={{ fontWeight: 700, fontSize: '16px', color: 'var(--flup-text-primary)' }}>{c.etudiants}</span>
                </div>
                <div style={{ width: '1px', background: 'var(--flup-border)' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--flup-text-muted)' }}>
                    <Clock size={14} /> <span className="flup-label">Volume</span>
                  </div>
                  <span className="flup-mono" style={{ fontWeight: 700, fontSize: '16px', color: 'var(--flup-text-primary)' }}>{c.volume}</span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="flup-btn" style={{ flex: 1, justifyContent: 'center', color: 'var(--flup-text-secondary)' }}>
                <BookOpen size={16} style={{ marginRight: '8px' }} /> Programme
              </button>
              <button className="flup-btn flup-btn--primary" onClick={() => navigate('/enseignant/notes')} style={{ flex: 1, justifyContent: 'center' }}>
                Notes <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MesCours;
