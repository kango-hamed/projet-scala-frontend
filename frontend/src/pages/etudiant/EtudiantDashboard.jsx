import React from 'react';
import { BookOpen, Calendar, AlertTriangle, Award } from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import WeekCalendar from '../../components/common/WeekCalendar'; // on réutilise le calendrier !

const EtudiantDashboard = () => {
  const recentGrades = [
    { id: 1, matiere: 'Algorithmique', note: 14.5, type: 'Contrôle Continu', statut: 'Admis' },
    { id: 2, matiere: 'Mathématiques', note: 9, type: 'Examen', statut: 'Redoublement' },
    { id: 3, matiere: 'Bases de données', note: 16, type: 'Projet', statut: 'Admis' },
  ];

  const columns = [
    { key: 'matiere', label: 'Matière' },
    { key: 'type', label: 'Évaluation' },
    { 
      key: 'note', 
      label: 'Note / 20',
      render: (val) => <span style={{ fontWeight: 'bold', color: val >= 10 ? '#059669' : '#dc2626' }}>{val}</span>
    },
    { 
      key: 'statut', 
      label: 'Décision', 
      render: (val) => <StatusBadge status={val} /> 
    }
  ];

  const myEvents = [
    { day: 0, start: 0, title: 'Algorithmique', room: 'Amphi A', prof: 'Prof. Martin', color: 'event-blue' },
    { day: 1, start: 1, title: 'Mathématiques', room: 'Amphi B', prof: 'Prof. Bernard', color: 'event-orange' },
    { day: 3, start: 2, title: 'Anglais', room: 'Salle 204', prof: 'Mme. Smith', color: 'event-pink' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* SECTION 1: KPIS */}
      <section>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Mon Semestre</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <KPICard title="Moyenne Générale" value="13.16" icon={<Award size={24} />} color="#10b981" />
          <KPICard title="Rang Promotion" value="15 / 120" icon={<BookOpen size={24} />} color="#4f46e5" />
          <KPICard title="Heures d'absence" value="4h" icon={<AlertTriangle size={24} />} color="#f59e0b" />
          <KPICard title="Prochain Cours" value="Maths (10h)" icon={<Calendar size={24} />} color="#8b5cf6" />
        </div>
      </section>

      {/* SECTION 2: GRADES & PAYMENTS */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Mes Dernières Notes</h3>
          <DataTable columns={columns} data={recentGrades} searchable={false} />
        </div>
        
        <div style={{ background: 'var(--surface-light)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Prochains Paiements</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600' }}>Frais de scolarité - Tranche 2</span>
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>150 000 FCFA</span>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Échéance : 15 Nov 2026</div>
              <div style={{ width: '100%', height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '30%', height: '100%', background: 'var(--secondary-color)' }}></div>
              </div>
              <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'right', color: 'var(--text-secondary)' }}>30% payé</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CALENDAR */}
      <section>
        <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Mon Emploi du temps</h3>
        <WeekCalendar events={myEvents} />
      </section>

    </div>
  );
};

export default EtudiantDashboard;
