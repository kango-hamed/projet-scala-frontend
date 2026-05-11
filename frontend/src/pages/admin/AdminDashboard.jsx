import React from 'react';
import { Users, GraduationCap, AlertTriangle, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import KPICard from '../../components/common/KPICard';
import StatusBadge from '../../components/common/StatusBadge';

const AdminDashboard = () => {
  // Fake Data for charts
  const attendanceData = [
    { name: 'Info', present: 85, absent: 15 },
    { name: 'Maths', present: 90, absent: 10 },
    { name: 'Phys', present: 78, absent: 22 },
    { name: 'Chimie', present: 82, absent: 18 },
  ];

  const studentDistData = [
    { name: 'L1', value: 400 },
    { name: 'L2', value: 300 },
    { name: 'L3', value: 250 },
    { name: 'M1', value: 150 },
    { name: 'M2', value: 100 },
  ];
  
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* KPIS */}
      <section>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Aperçu Global</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <KPICard title="Total Étudiants" value="1,200" icon={<Users size={24} />} trend={5} color="#4f46e5" />
          <KPICard title="Total Enseignants" value="150" icon={<GraduationCap size={24} />} trend={2} color="#10b981" />
          <KPICard title="Taux d'absentéisme" value="8%" icon={<AlertTriangle size={24} />} trend={-1.5} color="#f59e0b" />
          <KPICard title="Paiements en attente" value="45" icon={<CreditCard size={24} />} trend={12} color="#ef4444" />
        </div>
      </section>

      {/* CHARTS */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: 'var(--surface-light)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Répartition par Niveau</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={studentDistData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {studentDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: 'var(--surface-light)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Assiduité par Filière (%)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} />
                <Bar dataKey="present" stackId="a" fill="var(--secondary-color)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="absent" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* RECENT ACTIVITY TABLE */}
      <section style={{ background: 'var(--surface-light)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Dernières Inscriptions</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem', fontWeight: '500' }}>Matricule</th>
                <th style={{ padding: '1rem', fontWeight: '500' }}>Nom</th>
                <th style={{ padding: '1rem', fontWeight: '500' }}>Filière</th>
                <th style={{ padding: '1rem', fontWeight: '500' }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>ETU-2026-001</td>
                <td style={{ padding: '1rem' }}>Alice Dupont</td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Informatique L1</td>
                <td style={{ padding: '1rem' }}><StatusBadge status="Validée" /></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>ETU-2026-002</td>
                <td style={{ padding: '1rem' }}>Marc Tremblay</td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Mathématiques L2</td>
                <td style={{ padding: '1rem' }}><StatusBadge status="En attente" /></td>
              </tr>
              <tr>
                <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>ETU-2026-003</td>
                <td style={{ padding: '1rem' }}>Sophie Martin</td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Physique M1</td>
                <td style={{ padding: '1rem' }}><StatusBadge status="Annulée" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
