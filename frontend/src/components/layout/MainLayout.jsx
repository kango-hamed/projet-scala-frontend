import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Home, User, Settings, Users, BookOpen, Calendar, CreditCard, BarChart2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './MainLayout.css';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const role = user?.role || 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuByRole = () => {
    switch(role) {
      case 'admin':
        return [
          { name: 'Tableau de bord', path: '/admin', icon: <Home size={16} /> },
          { name: 'Étudiants', path: '/admin/etudiants', icon: <Users size={16} /> },
          { name: 'Enseignants', path: '/admin/enseignants', icon: <User size={16} /> },
          { name: 'Formations', path: '/admin/formations', icon: <BookOpen size={16} /> },
          { name: 'Emplois du temps', path: '/admin/emplois', icon: <Calendar size={16} /> },
          { name: 'Paiements', path: '/admin/paiements', icon: <CreditCard size={16} /> },
          { name: 'Big Data', path: '/admin/bigdata', icon: <BarChart2 size={16} /> },
          { name: 'Paramètres', path: '/admin/parametres', icon: <Settings size={16} /> },
        ];
      case 'enseignant':
        return [
          { name: 'Tableau de bord', path: '/enseignant', icon: <Home size={16} /> },
          { name: 'Mes Cours', path: '/enseignant/cours', icon: <BookOpen size={16} /> },
          { name: 'Saisie Notes', path: '/enseignant/notes', icon: <BookOpen size={16} /> },
          { name: 'Mon Profil', path: '/enseignant/profil', icon: <User size={16} /> },
        ];
      case 'etudiant':
        return [
          { name: 'Tableau de bord', path: '/etudiant', icon: <Home size={16} /> },
          { name: 'Mon Profil', path: '/etudiant/profil', icon: <User size={16} /> },
          { name: 'Mes Notes', path: '/etudiant/notes', icon: <BookOpen size={16} /> },
          { name: 'Mon Emploi', path: '/etudiant/emploi', icon: <Calendar size={16} /> },
          { name: 'Mes Paiements', path: '/etudiant/paiements', icon: <CreditCard size={16} /> },
        ];
      default: return [];
    }
  };

  const menuItems = getMenuByRole();

  // Helper pour initiales avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="main-layout">
      {/* FLUP Sidebar */}
      <aside className="flup-sidebar">
        <div className="sidebar-header">
          <h2 className="flup-h2">UnivGest</h2>
          <span className="flup-badge flup-badge--up" style={{textTransform: 'uppercase'}}>{role}</span>
        </div>
        
        <nav className="sidebar-nav">
          <div className="flup-section-label" style={{margin: '0 16px 8px 16px'}}>Menu principal</div>
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={idx} 
                to={item.path} 
                className={`flup-nav-item ${isActive ? 'flup-nav-item--active' : ''}`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="sidebar-footer">
          <hr className="flup-divider" style={{margin: '0 16px 16px 16px'}} />
          <div className="user-profile-row">
            <div className="flup-avatar flup-avatar--md">
              {getInitials(user?.name)}
            </div>
            <div className="user-info">
              <p className="flup-h2" style={{fontSize: '13.5px'}}>{user?.name}</p>
              <p className="flup-label">{user?.email}</p>
            </div>
          </div>
          <button 
            className="flup-nav-item logout-nav-item" 
            onClick={handleLogout} 
            style={{width: '100%', border: 'none', background: 'transparent', marginTop: '12px'}}
          >
            <LogOut size={16} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="header-title">
            <h1 className="flup-h1">
              Espace {role.charAt(0).toUpperCase() + role.slice(1)}
            </h1>
          </div>
          <div className="header-actions">
            {/* Toggle Switch design-system FLUP mock */}
            <div className="flup-toggle" title="Mode sombre (Mock)"></div>
            <div className="flup-avatar flup-avatar--md" title={user?.name}>
              {getInitials(user?.name)}
            </div>
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
