import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirection automatique si déjà connecté
  if (isAuthenticated && user) {
    const rolePath = user.role?.toLowerCase() || 'etudiant';
    return <Navigate to={`/${rolePath}`} replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result && result.success) {
      const rolePath = result.role?.toLowerCase() || 'etudiant';
      navigate(`/${rolePath}`);
    } else {
      setError(result?.erreur || "Erreur de connexion. Veuillez vérifier vos identifiants.");
    }
  };

  return (
    <div className="login-container">
      <div className="flup-card login-card" style={{ maxWidth: '400px', width: '100%', padding: '40px 32px' }}>
        <div className="login-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 className="flup-h1" style={{ marginBottom: '8px', color: 'var(--flup-accent)' }}>UnivGest</h2>
          <p className="flup-label">Bienvenue sur votre espace universitaire</p>
        </div>
        
        {error && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <div className="role-buttons" style={{ display: 'flex', marginTop: '16px' }}>
            <button 
              type="submit" 
              className="flup-btn flup-btn--primary" 
              style={{ width: '100%', opacity: isLoading ? 0.7 : 1 }}
              disabled={isLoading}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
