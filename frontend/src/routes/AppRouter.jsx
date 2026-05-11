import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Guard
import AuthLayout from '../components/layout/AuthLayout';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages Communes
import LoginPage from '../pages/auth/LoginPage';
import Profil from '../pages/common/Profil'; // <-- Import Profil

// Pages Admin
import AdminDashboard from '../pages/admin/AdminDashboard';
import EtudiantsList from '../pages/admin/EtudiantsList';
import EnseignantsList from '../pages/admin/EnseignantsList';
import FormationsList from '../pages/admin/FormationsList';
import EmploiDuTemps from '../pages/admin/EmploiDuTemps';
import PaiementsList from '../pages/admin/PaiementsList';
import Parametres from '../pages/admin/Parametres';

// Pages Enseignant
import EnseignantDashboard from '../pages/enseignant/EnseignantDashboard';
import MesCours from '../pages/enseignant/MesCours'; // <-- Import Mes Cours
import SaisieNotes from '../pages/enseignant/SaisieNotes';

// Pages Étudiant
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
            <Route path="enseignants" element={<EnseignantsList />} />
            <Route path="formations" element={<FormationsList />} />
            <Route path="emplois" element={<EmploiDuTemps />} />
            <Route path="paiements" element={<PaiementsList />} />
            <Route path="parametres" element={<Parametres />} />
          </Route>
        </Route>

        {/* ROUTES ENSEIGNANT */}
        <Route element={<ProtectedRoute allowedRoles={['enseignant']} />}>
          <Route path="/enseignant" element={<MainLayout />}>
            <Route index element={<EnseignantDashboard />} />
            <Route path="cours" element={<MesCours />} /> {/* <-- Route ajoutée */}
            <Route path="notes" element={<SaisieNotes />} />
            <Route path="profil" element={<Profil />} /> {/* <-- Route ajoutée */}
          </Route>
        </Route>

        {/* ROUTES ÉTUDIANT */}
        <Route element={<ProtectedRoute allowedRoles={['etudiant']} />}>
          <Route path="/etudiant" element={<MainLayout />}>
            <Route index element={<EtudiantDashboard />} />
            <Route path="emploi" element={<EmploiDuTemps />} />
            <Route path="profil" element={<Profil />} /> {/* <-- Également dispo pour l'étudiant */}
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
