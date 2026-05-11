import React from 'react';
import { BookOpen, AlertCircle, Calendar as CalIcon, Users } from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import WeekCalendar from '../../components/common/WeekCalendar';

const EnseignantDashboard = () => {
  const events = [
    { day: 0, start: 0, title: 'Algorithmique', room: 'Amphi A', prof: 'Moi', color: 'event-blue' },
    { day: 1, start: 2, title: 'Mathématiques', room: 'Salle 102', prof: 'Moi', color: 'event-orange' },
    { day: 3, start: 1, title: 'Soutien Prog C', room: 'Labo 4', prof: 'Moi', color: 'event-purple' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <section>
        <h2 className="flup-h2" style={{ marginBottom: '16px' }}>Aperçu du Semestre</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <KPICard title="Cours assignés" value="3" icon={<BookOpen size={24} />} color="var(--flup-data-1)" />
          <KPICard title="Total Étudiants" value="105" icon={<Users size={24} />} color="var(--flup-data-5)" />
          <KPICard title="Heures cette semaine" value="12h" icon={<CalIcon size={24} />} color="var(--flup-data-2)" />
          <KPICard title="Notes à Saisir" value="15" icon={<AlertCircle size={24} />} color="var(--flup-danger)" />
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
        <section className="flup-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="flup-h2" style={{ margin: 0 }}>Mon Emploi du temps (Semaine Actuelle)</h2>
            <span className="flup-badge" style={{ background: 'var(--flup-bg)', color: 'var(--flup-text-secondary)' }}>Semestre 1</span>
          </div>
          <WeekCalendar events={events} />
        </section>
      </div>

    </div>
  );
};

export default EnseignantDashboard;
