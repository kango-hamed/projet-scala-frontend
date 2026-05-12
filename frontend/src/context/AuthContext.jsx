import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Création du contexte
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Au montage : vérifier si un token est présent et le valider via /auth/me
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();
        // L'API renvoie { success, utilisateur } ou { success, data }
        if (response.success) {
          const userData = response.utilisateur || response.data;
          if (userData) {
            setUser(userData);
          } else {
            localStorage.removeItem('token');
          }
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Erreur de récupération de l'utilisateur", error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Fonction de connexion exposée par le contexte
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);

      if (response.success) {
        // Le backend renvoie { success, token, utilisateur }
        const token = response.token || response.data?.token;
        const userData = response.utilisateur || response.data;

        if (token) {
          localStorage.setItem('token', token);
        }

        if (userData) {
          setUser(userData);
          return { success: true, role: userData.role };
        }

        return { success: false, erreur: "Données utilisateur manquantes dans la réponse." };
      }

      return response; // success: false avec erreur métier
    } catch (error) {
      return error; // { success: false, erreur: "..." }
    }
  };

  // Fonction de déconnexion exposée par le contexte
  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await authService.logout();
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion API", error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // Ne rien afficher tant que la vérification initiale n'est pas finie
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser l'authentification facilement
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
