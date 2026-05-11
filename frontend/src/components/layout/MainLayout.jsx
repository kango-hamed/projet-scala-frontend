import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Home, User, Settings, Users, BookOpen, Calendar, CreditCard, BarChart2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './MainLayout.css';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth(); // On récupère l'utilisateur depuis le contexte

  const role = user?.role || 'admin';

  const handleLogout = () => {
    logout(); // Efface la session du contexte
    navigate('/login');
  };

  const getMenuByRole = () => {
    switch(role) {
      case 'admin':
        return [
          { name: 'Tableau de bord', path: '/admin', icon: <Home size={20} /> },
          { name: 'Étudiants', path: '/admin/etudiants', icon: <Users size={20} /> },
          { name: 'Enseignants', path: '/admin/enseignants', icon: <User size={20} /> },
          { name: 'Formations', path: '/admin/formations', icon: <BookOpen size={20} /> },
          { name: 'Emplois du temps', path: '/admin/emplois', icon: <Calendar size={20} /> },
          { name: 'Paiements', path: '/admin/paiements', icon: <CreditCard size={20} /> },
          { name: 'Big Data', path: '/admin/bigdata', icon: <BarChart2 size={20} /> },
          { name: 'Paramètres', path: '/admin/parametres', icon: <Settings size={20} /> },
        ];
      case 'enseignant':
        return [
          { name: 'Tableau de bord', path: '/enseignant', icon: <Home size={20} /> },
          { name: 'Mes Cours', path: '/enseignant/cours', icon: <BookOpen size={20} /> },
          { name: 'Saisie Notes', path: '/enseignant/notes', icon: <BookOpen size={20} /> },
          { name: 'Mon Profil', path: '/enseignant/profil', icon: <User size={20} /> },
        ];
      case 'etudiant':
        return [
          { name: 'Tableau de bord', path: '/etudiant', icon: <Home size={20} /> },
          { name: 'Mon Profil', path: '/etudiant/profil', icon: <User size={20} /> },
          { name: 'Mes Notes', path: '/etudiant/notes', icon: <BookOpen size={20} /> },
          { name: 'Mon Emploi', path: '/etudiant/emploi', icon: <Calendar size={20} /> },
          { name: 'Mes Paiements', path: '/etudiant/paiements', icon: <CreditCard size={20} /> },
        ];
      default: return [];
    }
  };

  const menuItems = getMenuByRole();

  return (
    <div className="main-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>UnivGest</h2>
          <span className="role-badge">{role}</span>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item, idx) => (
            <Link 
              key={idx} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ padding: '0.5rem 1rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <p style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-primary)' }}>{user?.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user?.email}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout} style={{ marginTop: '0.5rem' }}>
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="top-header">
          <div className="header-title">
            <h1>Espace {role.charAt(0).toUpperCase() + role.slice(1)}</h1>
          </div>
          <div className="header-profile">
            <div className="avatar" title={user?.name}></div>
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
