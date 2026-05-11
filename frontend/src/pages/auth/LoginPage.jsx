import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');

  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  const handleLogin = (e, role) => {
    e.preventDefault();
    login(role, email);
    navigate(`/${role}`);
  };

  return (
    <div className="login-container">
      <div className="flup-card login-card" style={{ maxWidth: '400px', width: '100%', padding: '40px 32px' }}>
        <div className="login-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 className="flup-h1" style={{ marginBottom: '8px', color: 'var(--flup-accent)' }}>UnivGest</h2>
          <p className="flup-label">Bienvenue sur votre espace universitaire</p>
        </div>
        <form className="login-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="input-group">
            <label className="flup-label" style={{ color: 'var(--flup-text-secondary)', fontWeight: 600 }}>Email</label>
            <input 
              type="email" 
              placeholder="votre.email@universite.edu" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label className="flup-label" style={{ color: 'var(--flup-text-secondary)', fontWeight: 600 }}>Mot de passe</label>
            <input type="password" placeholder="••••••••" required />
          </div>
          
          <div className="flup-section-label" style={{ textAlign: 'center', marginTop: '16px', marginBottom: '8px' }}>Connexion Rapide (Démo)</div>
          
          <div className="role-buttons" style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="flup-btn" onClick={(e) => handleLogin(e, 'admin')}>Admin</button>
            <button type="button" className="flup-btn" onClick={(e) => handleLogin(e, 'enseignant')}>Prof</button>
            <button type="button" className="flup-btn flup-btn--primary" onClick={(e) => handleLogin(e, 'etudiant')}>Étudiant</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
