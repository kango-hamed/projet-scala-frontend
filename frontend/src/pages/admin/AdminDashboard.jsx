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
  
  const COLORS = ['var(--flup-data-1)', 'var(--flup-data-5)', 'var(--flup-data-2)', 'var(--flup-data-6)', 'var(--flup-data-3)'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPIS */}
      <section>
        <h2 className="flup-h2" style={{ marginBottom: '16px' }}>Aperçu Global</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <KPICard title="Total Étudiants" value="1,200" icon={<Users size={24} />} color="var(--flup-data-1)" />
          <KPICard title="Total Enseignants" value="150" icon={<GraduationCap size={24} />} color="var(--flup-data-5)" />
          <KPICard title="Taux d'absentéisme" value="8%" icon={<AlertTriangle size={24} />} color="var(--flup-data-2)" />
          <KPICard title="Paiements en attente" value="45" icon={<CreditCard size={24} />} color="var(--flup-data-7)" />
        </div>
      </section>

      {/* CHARTS */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div className="flup-card">
          <h3 className="flup-h2" style={{ marginBottom: '24px' }}>Répartition par Niveau</h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={studentDistData} innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" stroke="none">
                  {studentDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--flup-border)', boxShadow: 'var(--flup-shadow)' }}
                  itemStyle={{ color: 'var(--flup-text-primary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flup-card">
          <h3 className="flup-h2" style={{ marginBottom: '24px' }}>Assiduité par Filière (%)</h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--flup-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--flup-text-muted)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--flup-text-muted)' }} dx={-10} />
                <Tooltip 
                  cursor={{fill: 'rgba(0,0,0,0.02)'}} 
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--flup-border)', boxShadow: 'var(--flup-shadow)' }}
                />
                <Bar dataKey="present" stackId="a" fill="var(--flup-data-4)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="absent" stackId="a" fill="var(--flup-data-7)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* RECENT ACTIVITY TABLE */}
      <section className="flup-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--flup-border)' }}>
          <h3 className="flup-h2" style={{ margin: 0 }}>Dernières Inscriptions</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="flup-table">
            <thead>
              <tr>
                <th>Matricule</th>
                <th>Nom</th>
                <th>Filière</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 700 }}>ETU-2026-001</td>
                <td>Alice Dupont</td>
                <td style={{ color: 'var(--flup-text-secondary)' }}>Informatique L1</td>
                <td><StatusBadge status="Validée" /></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>ETU-2026-002</td>
                <td>Marc Tremblay</td>
                <td style={{ color: 'var(--flup-text-secondary)' }}>Mathématiques L2</td>
                <td><StatusBadge status="En attente" /></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>ETU-2026-003</td>
                <td>Sophie Martin</td>
                <td style={{ color: 'var(--flup-text-secondary)' }}>Physique M1</td>
                <td><StatusBadge status="Annulée" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
