import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, AlertTriangle, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import KPICard from '../../components/common/KPICard';
import StatusBadge from '../../components/common/StatusBadge';
import etudiantService from '../../services/etudiantService';
import enseignantService from '../../services/enseignantService';
import scolariteService from '../../services/scolariteService';
import financeService from '../../services/financeService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEtudiants: '...',
    totalEnseignants: '...',
    absencesARisque: '...',
    paiementsEnAttente: '...',
  });
  const [recentEtudiants, setRecentEtudiants] = useState([]);
  
  // Données dynamiques pour le graphique de répartition
  const [studentDistData, setStudentDistData] = useState([
    { name: 'Vide', value: 1 } // Fallback initial
  ]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [etudiantsRes, enseignantsRes, absencesRes, dettesRes] = await Promise.allSettled([
        etudiantService.getAll(),
        enseignantService.getAll(),
        scolariteService.getAbsencesARisque(),
        financeService.getEnDette()
      ]);

      const newStats = { ...stats };
      let recents = [];

      if (etudiantsRes.status === 'fulfilled' && etudiantsRes.value.success) {
        const etudiantsList = etudiantsRes.value.data || [];
        newStats.totalEtudiants = etudiantsList.length;
        recents = etudiantsList.slice(-5).reverse();

        // Calcul dynamique de la répartition par niveau
        if (etudiantsList.length > 0) {
          const niveauxMap = {};
          etudiantsList.forEach(etu => {
            const niv = etu.niveau || 'Autre';
            niveauxMap[niv] = (niveauxMap[niv] || 0) + 1;
          });
          const distData = Object.keys(niveauxMap).map(key => ({
            name: key,
            value: niveauxMap[key]
          }));
          setStudentDistData(distData);
        } else {
          setStudentDistData([]); // Vide
        }
      }

      if (enseignantsRes.status === 'fulfilled' && enseignantsRes.value.success) {
        newStats.totalEnseignants = (enseignantsRes.value.data || []).length;
      }

      if (absencesRes.status === 'fulfilled' && absencesRes.value.success) {
        newStats.absencesARisque = (absencesRes.value.data || []).length;
      }

      if (dettesRes.status === 'fulfilled' && dettesRes.value.success) {
        newStats.paiementsEnAttente = (dettesRes.value.data || []).length;
      }

      setStats(newStats);
      setRecentEtudiants(recents);

    } catch (error) {
      console.error("Erreur chargement dashboard", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fausses données pour le graphique d'absences (nécessite un croisement complexe non natif dans l'API)
  const attendanceData = [
    { name: 'Info', present: 85, absent: 15 },
    { name: 'Maths', present: 90, absent: 10 },
    { name: 'Phys', present: 78, absent: 22 },
    { name: 'Chimie', present: 82, absent: 18 },
  ];
  
  const COLORS = ['var(--flup-data-1)', 'var(--flup-data-5)', 'var(--flup-data-2)', 'var(--flup-data-6)', 'var(--flup-data-3)', 'var(--flup-data-7)'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPIS */}
      <section>
        <h2 className="flup-h2" style={{ marginBottom: '16px' }}>Aperçu Global</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <KPICard title="Total Étudiants" value={stats.totalEtudiants} icon={<Users size={24} />} color="var(--flup-data-1)" />
          <KPICard title="Total Enseignants" value={stats.totalEnseignants} icon={<GraduationCap size={24} />} color="var(--flup-data-5)" />
          <KPICard title="Étudiants à risque (Absences)" value={stats.absencesARisque} icon={<AlertTriangle size={24} />} color="var(--flup-data-2)" />
          <KPICard title="Paiements en attente" value={stats.paiementsEnAttente} icon={<CreditCard size={24} />} color="var(--flup-data-7)" />
        </div>
      </section>

      {/* CHARTS */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div className="flup-card">
          <h3 className="flup-h2" style={{ marginBottom: '24px' }}>Répartition par Niveau</h3>
          <div style={{ height: '260px' }}>
            {studentDistData.length > 0 ? (
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
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--flup-text-muted)' }}>
                Aucune donnée
              </div>
            )}
          </div>
        </div>

        <div className="flup-card">
          <h3 className="flup-h2" style={{ marginBottom: '24px' }}>Assiduité par Filière (%) (Simulé)</h3>
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
          <h3 className="flup-h2" style={{ margin: 0 }}>Derniers Étudiants Enregistrés</h3>
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
              {recentEtudiants.length > 0 ? (
                recentEtudiants.map((etu, idx) => (
                  <tr key={etu.matricule || etu.id || idx}>
                    <td style={{ fontWeight: 700 }}>{etu.matricule || etu.id || `ETU-N/A`}</td>
                    <td>{etu.prenom} {etu.nom}</td>
                    <td style={{ color: 'var(--flup-text-secondary)' }}>{etu.filiere || 'Informatique'} {etu.niveau || ''}</td>
                    <td><StatusBadge status={etu.statut || 'Actif'} /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: 'var(--flup-text-secondary)' }}>
                    {isLoading ? 'Chargement en cours...' : 'Aucun étudiant trouvé'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
