import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier s'il y a une session sauvegardée au chargement (LocalStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('univgest_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (role, email) => {
    // Simulation d'une réponse API pour l'authentification
    const userData = {
      id: Math.floor(Math.random() * 1000),
      email: email || `${role}@universite.edu`,
      role: role,
      name: role === 'admin' ? 'Admin Principal' : role === 'enseignant' ? 'Professeur Dupont' : 'Étudiant Martin'
    };
    
    // Mettre à jour l'état local et sauvegarder dans le navigateur
    setUser(userData);
    localStorage.setItem('univgest_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('univgest_user');
  };

  // Ne rien afficher tant que la vérification initiale de session n'est pas finie
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
