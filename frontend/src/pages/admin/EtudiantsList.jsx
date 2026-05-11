import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import EtudiantForm from './forms/EtudiantForm';

// Jeu de données initial simulé
const initialEtudiants = [
  { id: 1, matricule: 'ETU-26-001', nom: 'Dupont', prenom: 'Alice', filiere: 'Informatique', niveau: 'L1', statut: 'Validée' },
  { id: 2, matricule: 'ETU-26-002', nom: 'Martin', prenom: 'Lucas', filiere: 'Mathématiques', niveau: 'L2', statut: 'Suspendu' },
  { id: 3, matricule: 'ETU-26-003', nom: 'Bernard', prenom: 'Sophie', filiere: 'Physique', niveau: 'M1', statut: 'Validée' },
  { id: 4, matricule: 'ETU-26-004', nom: 'Thomas', prenom: 'Hugo', filiere: 'Informatique', niveau: 'L3', statut: 'Validée' },
  { id: 5, matricule: 'ETU-26-005', nom: 'Petit', prenom: 'Emma', filiere: 'Chimie', niveau: 'L1', statut: 'En attente' },
  { id: 6, matricule: 'ETU-26-006', nom: 'Robert', prenom: 'Léo', filiere: 'Informatique', niveau: 'M2', statut: 'Validée' },
];

const EtudiantsList = () => {
  const [etudiants, setEtudiants] = useState(initialEtudiants);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEtudiant, setEditingEtudiant] = useState(null);

  // Gérer l'ouverture de la Modale (soit pour Ajouter, soit pour Éditer)
  const handleOpenModal = (etudiant = null) => {
    setEditingEtudiant(etudiant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEtudiant(null);
  };

  // Soumission du formulaire (Création ou Mise à jour)
  const handleSubmit = (formData) => {
    if (editingEtudiant) {
      // Édition
      setEtudiants(etudiants.map(e => e.id === editingEtudiant.id ? { ...e, ...formData } : e));
    } else {
      // Ajout
      const newEtudiant = {
        ...formData,
        id: Date.now() // Faux ID unique
      };
      setEtudiants([newEtudiant, ...etudiants]);
    }
    handleCloseModal(); // Fermer la modale
  };

  // Suppression d'un étudiant
  const handleDelete = (id) => {
    if(window.confirm('Voulez-vous vraiment supprimer cet étudiant ?')) {
      setEtudiants(etudiants.filter(e => e.id !== id));
    }
  };

  // Configuration des colonnes pour la DataTable
  const columns = [
    { key: 'matricule', label: 'Matricule' },
    { key: 'nom', label: 'Nom' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'filiere', label: 'Filière' },
    { key: 'niveau', label: 'Niveau' },
    { 
      key: 'statut', 
      label: 'Statut', 
      render: (val) => <StatusBadge status={val} /> 
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => handleOpenModal(row)}
            style={{ color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.875rem' }}
          >
            Éditer
          </button>
          <button 
            onClick={() => handleDelete(row.id)}
            style={{ color: '#ef4444', fontWeight: '600', fontSize: '0.875rem' }}
          >
            Supprimer
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Gestion des Étudiants</h2>
        <button 
          onClick={() => handleOpenModal()}
          style={{ 
            background: 'var(--primary-color)', 
            color: 'white', 
            padding: '0.75rem 1.25rem', 
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s'
          }}
        >
          <Plus size={20} /> Nouvel Étudiant
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={etudiants} 
        searchable={true} 
        exportable={true} 
      />

      {/* Intégration de la Modale */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingEtudiant ? "Modifier l'étudiant" : "Ajouter un étudiant"}
      >
        <EtudiantForm 
          initialData={editingEtudiant} 
          onSubmit={handleSubmit} 
          onCancel={handleCloseModal} 
        />
      </Modal>
    </div>
  );
};

export default EtudiantsList;
