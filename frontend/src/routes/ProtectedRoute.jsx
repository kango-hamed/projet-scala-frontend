import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  // Si l'utilisateur n'est pas connecté, redirection stricte vers le login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur est connecté mais n'a pas le bon rôle pour cette route
  if (allowedRoles && user.role && !allowedRoles.includes(user.role.toLowerCase())) {
    // On le ramène de force vers son propre tableau de bord
    return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
  }

  // Tout est bon, on affiche les enfants (les pages protégées)
  return <Outlet />;
};

export default ProtectedRoute;
