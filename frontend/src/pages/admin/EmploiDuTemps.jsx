import React from 'react';
import WeekCalendar from '../../components/common/WeekCalendar';

const mockEvents = [
  { day: 0, start: 0, title: 'Algorithmique', room: 'Amphi A', prof: 'Prof. Martin', color: 'event-blue' },
  { day: 0, start: 2, title: 'Base de Données', room: 'Salle 102', prof: 'Prof. Dupont', color: 'event-green' },
  { day: 1, start: 1, title: 'Mathématiques Appliquées', room: 'Amphi B', prof: 'Prof. Bernard', color: 'event-orange' },
  { day: 2, start: 0, title: 'Physique Quantique', room: 'Labo 1', prof: 'Prof. Thomas', color: 'event-purple' },
  { day: 3, start: 3, title: 'Anglais Technique', room: 'Salle 204', prof: 'Mme. Smith', color: 'event-pink' },
  { day: 4, start: 1, title: 'Réseaux & Télécoms', room: 'Amphi A', prof: 'Prof. Martin', color: 'event-green' },
];

const EmploiDuTemps = () => {
  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Emploi du Temps</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Filière: Informatique L1 - Semaine 42</p>
        </div>
        <select style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none' }}>
          <option>Informatique L1</option>
          <option>Mathématiques L2</option>
        </select>
      </div>
      <WeekCalendar events={mockEvents} />
    </div>
  );
};

export default EmploiDuTemps;
