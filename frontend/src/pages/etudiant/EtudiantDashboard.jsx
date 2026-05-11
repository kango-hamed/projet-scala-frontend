import React from 'react';
import { BookOpen, Calendar, AlertTriangle, Award } from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import WeekCalendar from '../../components/common/WeekCalendar';

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
      render: (val) => <span className="flup-mono" style={{ fontWeight: '700', fontSize: '14px', color: val >= 10 ? 'var(--flup-success)' : 'var(--flup-danger)' }}>{val}</span>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* SECTION 1: KPIS */}
      <section>
        <h2 className="flup-h2" style={{ marginBottom: '16px' }}>Mon Semestre</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <KPICard title="Moyenne Générale" value="13.16" icon={<Award size={24} />} color="var(--flup-data-5)" />
          <KPICard title="Rang Promotion" value="15 / 120" icon={<BookOpen size={24} />} color="var(--flup-data-1)" />
          <KPICard title="Heures d'absence" value="4h" icon={<AlertTriangle size={24} />} color="var(--flup-data-2)" />
          <KPICard title="Prochain Cours" value="Maths (10h)" icon={<Calendar size={24} />} color="var(--flup-data-3)" />
        </div>
      </section>

      {/* SECTION 2: GRADES & PAYMENTS */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 className="flup-h2">Mes Dernières Notes</h3>
          <DataTable columns={columns} data={recentGrades} searchable={false} exportable={false} />
        </div>
        
        <div className="flup-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 className="flup-h2" style={{ marginBottom: '24px' }}>Prochains Paiements</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', border: '1px solid var(--flup-border)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: '600', fontSize: '13.5px' }}>Frais de scolarité - Tranche 2</span>
                <span className="flup-mono" style={{ color: 'var(--flup-danger)', fontWeight: '700', fontSize: '14px' }}>150 000 FCFA</span>
              </div>
              <div className="flup-label" style={{ marginBottom: '16px' }}>Échéance : 15 Nov 2026</div>
              <div style={{ width: '100%', height: '6px', background: 'var(--flup-bg)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '30%', height: '100%', background: 'var(--flup-accent)' }}></div>
              </div>
              <div className="flup-label" style={{ marginTop: '8px', textAlign: 'right' }}>30% payé</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CALENDAR */}
      <section>
        <h3 className="flup-h2" style={{ marginBottom: '16px' }}>Mon Emploi du temps</h3>
        <WeekCalendar events={myEvents} />
      </section>

    </div>
  );
};

export default EtudiantDashboard;
