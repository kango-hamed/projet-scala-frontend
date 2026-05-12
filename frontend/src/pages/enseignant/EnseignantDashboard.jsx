import React, { useState, useEffect } from 'react';
import { BookOpen, AlertCircle, Calendar as CalIcon, Users, Loader2 } from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import WeekCalendar from '../../components/common/WeekCalendar';
import { useAuth } from '../../context/AuthContext';
import enseignantService from '../../services/enseignantService';

const EnseignantDashboard = () => {
  const { user } = useAuth();
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCours = async () => {
      // Récupérer l'ID enseignant depuis tous les champs possibles retournés par l'API
      const enseignantId = user?.idProfil ?? user?.idEnseignant ?? user?.enseignantId ?? user?.id;

      // Debug : afficher la structure user pour identifier le bon champ
      console.log('[EnseignantDashboard] user object:', user);
      console.log('[EnseignantDashboard] enseignantId utilisé:', enseignantId);

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

  // Calcul des KPIs dynamiquement depuis les cours réels
  const totalCours = cours.length;
  const totalEtudiants = cours.reduce((sum, c) => sum + (c.nombreEtudiants || c.etudiants || 0), 0);
  const totalHeures = cours.reduce((sum, c) => sum + (c.volumeHoraire || c.volume || 0), 0);

  // Construction des events pour le calendrier (on positionne par index si pas de données horaires)
  const colors = ['event-blue', 'event-orange', 'event-purple', 'event-green'];
  const events = cours.slice(0, 5).map((c, idx) => ({
    day: idx % 5,
    start: idx % 4,
    title: c.nom || c.ue || c.libelle || `Cours ${idx + 1}`,
    room: c.salle || 'Salle à définir',
    prof: user?.name || 'Moi',
    color: colors[idx % colors.length],
  }));

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '16px', color: 'var(--flup-text-secondary)' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <p className="flup-label">Chargement du tableau de bord...</p>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Message de bienvenue */}
      <div>
        <h2 className="flup-h2" style={{ marginBottom: '4px' }}>
          Bonjour, {user?.name || 'Enseignant'} 👋
        </h2>
        <p className="flup-label">Voici un aperçu de vos activités pour ce semestre.</p>
      </div>

      {/* KPIs */}
      <section>
        <h2 className="flup-h2" style={{ marginBottom: '16px' }}>Aperçu du Semestre</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <KPICard
            title="Cours assignés"
            value={totalCours}
            icon={<BookOpen size={24} />}
            color="var(--flup-data-1)"
          />
          <KPICard
            title="Total Étudiants"
            value={totalEtudiants}
            icon={<Users size={24} />}
            color="var(--flup-data-5)"
          />
          <KPICard
            title="Volume horaire total"
            value={totalHeures ? `${totalHeures}h` : 'N/A'}
            icon={<CalIcon size={24} />}
            color="var(--flup-data-2)"
          />
          <KPICard
            title="Cours sans notes"
            value={cours.filter(c => !c.noteSaisie).length || 0}
            icon={<AlertCircle size={24} />}
            color="var(--flup-danger)"
          />
        </div>
      </section>

      {/* Calendrier de la semaine */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
        <section className="flup-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="flup-h2" style={{ margin: 0 }}>Mon Emploi du temps (Semaine Actuelle)</h2>
            <span className="flup-badge" style={{ background: 'var(--flup-bg)', color: 'var(--flup-text-secondary)' }}>
              {cours.length > 0 ? `${cours.length} cours` : 'Aucun cours'}
            </span>
          </div>
          {events.length > 0 ? (
            <WeekCalendar events={events} />
          ) : (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--flup-text-muted)' }}>
              <BookOpen size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
              <p className="flup-label">Aucun cours assigné pour le moment.</p>
            </div>
          )}
        </section>
      </div>

    </div>
  );
};

export default EnseignantDashboard;
