import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Guard
import AuthLayout from '../components/layout/AuthLayout';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import EtudiantsList from '../pages/admin/EtudiantsList';
import FormationsList from '../pages/admin/FormationsList';
import EmploiDuTemps from '../pages/admin/EmploiDuTemps';
import EnseignantDashboard from '../pages/enseignant/EnseignantDashboard';
import SaisieNotes from '../pages/enseignant/SaisieNotes';
import EtudiantDashboard from '../pages/etudiant/EtudiantDashboard';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* ROUTES ADMIN */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<MainLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="etudiants" element={<EtudiantsList />} />
            <Route path="formations" element={<FormationsList />} />
            <Route path="emplois" element={<EmploiDuTemps />} />
          </Route>
        </Route>

        {/* ROUTES ENSEIGNANT */}
        <Route element={<ProtectedRoute allowedRoles={['enseignant']} />}>
          <Route path="/enseignant" element={<MainLayout />}>
            <Route index element={<EnseignantDashboard />} />
            <Route path="notes" element={<SaisieNotes />} />
          </Route>
        </Route>

        {/* ROUTES ÉTUDIANT */}
        <Route element={<ProtectedRoute allowedRoles={['etudiant']} />}>
          <Route path="/etudiant" element={<MainLayout />}>
            <Route index element={<EtudiantDashboard />} />
            {/* Si un étudiant va sur son propre emploi du temps : */}
            <Route path="emploi" element={<EmploiDuTemps />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
