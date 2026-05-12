import React, { useState, useEffect } from 'react';
import { Users, Clock, ArrowRight, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import enseignantService from '../../services/enseignantService';

const colors = [
  'var(--flup-data-1)',
  'var(--flup-data-5)',
  'var(--flup-data-3)',
  'var(--flup-data-2)',
  'var(--flup-data-4)',
];

const MesCours = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCours = async () => {
      const enseignantId = user?.idProfil ?? user?.idEnseignant ?? user?.enseignantId ?? user?.id;
      console.log('[MesCours] user object:', user);
      console.log('[MesCours] enseignantId utilisé:', enseignantId);

      if (!enseignantId) {
        setError('Impossible de déterminer votre identifiant enseignant.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await enseignantService.getCours(enseignantId);
        if (response.success) {
          setCours(response.data || []);
        } else {
          setError(response.erreur || 'Erreur lors du chargement des cours.');
        }
      } catch (err) {
        setError(err.erreur || 'Impossible de contacter le serveur.');
      } finally {
        setLoading(false);
      }
    };

    fetchCours();
  }, [user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '16px', color: 'var(--flup-text-secondary)' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <p className="flup-label">Chargement de vos cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--flup-danger)', background: 'var(--flup-danger-bg)', padding: '16px 24px', borderRadius: '12px', fontWeight: 600 }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="flup-h1">Mes Cours</h1>
          <p className="flup-label" style={{ marginTop: '8px' }}>
            Gérez vos matières et accédez rapidement à vos classes.
          </p>
        </div>
        <span className="flup-badge" style={{ background: 'var(--flup-bg)', color: 'var(--flup-text-secondary)' }}>
          {cours.length} cours assigné{cours.length > 1 ? 's' : ''}
        </span>
      </div>

      {cours.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', color: 'var(--flup-text-muted)' }}>
          <BookOpen size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
          <p className="flup-label" style={{ fontSize: '15px' }}>Aucun cours ne vous est assigné pour le moment.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {cours.map((c, idx) => {
            const nom = c.nom || c.ue || c.libelle || `Cours ${idx + 1}`;
            const niveau = c.niveau || c.filiere || c.formation || 'Niveau non précisé';
            const etudiants = c.nombreEtudiants ?? c.etudiants ?? '—';
            const volume = c.volumeHoraire != null ? `${c.volumeHoraire}h` : c.volume || '—';
            const color = colors[idx % colors.length];

            return (
              <div
                key={c.id || idx}
                className="flup-card"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color }}></div>
                    <h3 className="flup-h2" style={{ margin: 0, fontSize: '18px' }}>{nom}</h3>
                  </div>
                  <span className="flup-badge" style={{ background: 'var(--flup-bg)', color: 'var(--flup-text-secondary)', marginBottom: '24px', display: 'inline-block' }}>
                    {niveau}
                  </span>

                  <div style={{ display: 'flex', gap: '32px', marginBottom: '32px', padding: '16px', background: 'var(--flup-bg)', borderRadius: '10px', border: '1px solid var(--flup-border)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--flup-text-muted)' }}>
                        <Users size={14} /> <span className="flup-label">Inscrits</span>
                      </div>
                      <span className="flup-mono" style={{ fontWeight: 700, fontSize: '16px', color: 'var(--flup-text-primary)' }}>{etudiants}</span>
                    </div>
                    <div style={{ width: '1px', background: 'var(--flup-border)' }}></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--flup-text-muted)' }}>
                        <Clock size={14} /> <span className="flup-label">Volume</span>
                      </div>
                      <span className="flup-mono" style={{ fontWeight: 700, fontSize: '16px', color: 'var(--flup-text-primary)' }}>{volume}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="flup-btn" style={{ flex: 1, justifyContent: 'center', color: 'var(--flup-text-secondary)' }}>
                    <BookOpen size={16} style={{ marginRight: '8px' }} /> Programme
                  </button>
                  <button
                    className="flup-btn flup-btn--primary"
                    onClick={() => navigate('/enseignant/notes', { state: { coursId: c.id, coursNom: nom } })}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Notes <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MesCours;
