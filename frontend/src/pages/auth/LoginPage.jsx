import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');

  // Si l'utilisateur est déjà connecté, il est renvoyé vers son espace
  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  const handleLogin = (e, role) => {
    e.preventDefault();
    // On appelle la fonction de contexte qui va générer la session
    login(role, email);
    navigate(`/${role}`);
  };

  return (
    <div className="login-container">
      <div className="login-card glass-effect">
        <div className="login-header">
          <h2>UnivGest</h2>
          <p>Bienvenue sur votre espace universitaire</p>
        </div>
        <form className="login-form">
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="votre.email@universite.edu" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label>Mot de passe</label>
            <input type="password" placeholder="••••••••" required />
          </div>
          <div className="role-buttons">
            <button type="button" className="btn-role admin" onClick={(e) => handleLogin(e, 'admin')}>Admin</button>
            <button type="button" className="btn-role prof" onClick={(e) => handleLogin(e, 'enseignant')}>Enseignant</button>
            <button type="button" className="btn-role student" onClick={(e) => handleLogin(e, 'etudiant')}>Étudiant</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
