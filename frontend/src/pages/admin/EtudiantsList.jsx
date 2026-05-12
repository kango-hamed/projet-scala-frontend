import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import EtudiantForm from './forms/EtudiantForm';
import etudiantService from '../../services/etudiantService';

const EtudiantsList = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEtudiant, setEditingEtudiant] = useState(null);

  // Charger les étudiants au montage du composant
  useEffect(() => {
    fetchEtudiants();
  }, []);

  const fetchEtudiants = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await etudiantService.getAll();
      if (response.success) {
        setEtudiants(response.data || []);
      } else {
        setError(response.erreur || "Impossible de charger la liste des étudiants.");
      }
    } catch (err) {
      setError(err.erreur || "Erreur de communication avec l'API lors du chargement des étudiants.");
    } finally {
      setIsLoading(false);
    }
  };

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
  const handleSubmit = async (formData) => {
    try {
      if (editingEtudiant) {
        // Mise à jour de l'étudiant via l'API (on suppose que le matricule est la clé primaire)
        const matricule = editingEtudiant.matricule;
        const response = await etudiantService.update(matricule, formData);
        if (response.success) {
          fetchEtudiants(); // Rafraîchir les données
        } else {
          alert(response.erreur || "Erreur lors de la mise à jour de l'étudiant.");
        }
      } else {
        // Création d'un nouvel étudiant via l'API
        const response = await etudiantService.create(formData);
        if (response.success) {
          fetchEtudiants();
        } else {
          alert(response.erreur || "Erreur lors de la création de l'étudiant.");
        }
      }
      handleCloseModal();
    } catch (err) {
      alert(err.erreur || "Erreur réseau lors de la validation du formulaire.");
    }
  };

  // Suppression (L'API fournie ne décrit pas de route de suppression (DELETE), 
  // on affiche donc un message explicatif en attendant).
  const handleDelete = (matricule) => {
    alert("L'API ne supporte pas actuellement la suppression physique d'un étudiant. Veuillez plutôt changer son statut en 'Suspendu' ou 'Diplome'.");
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
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="flup-btn"
            onClick={() => handleOpenModal(row)}
            title="Éditer"
            style={{ padding: '6px 10px' }}
          >
            <Edit2 size={14} />
          </button>
          <button 
            className="flup-btn"
            onClick={() => handleDelete(row.matricule)}
            title="Supprimer"
            style={{ padding: '6px 10px', color: 'var(--flup-danger)' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="flup-h1">Gestion des Étudiants</h1>
        <button 
          className="flup-btn flup-btn--primary"
          onClick={() => handleOpenModal()}
        >
          <Plus size={16} /> Nouvel Étudiant
        </button>
      </div>

      {error && (
        <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--flup-text-secondary)' }}>
          Chargement des étudiants en cours...
        </div>
      ) : (
        <DataTable 
          columns={columns} 
          data={etudiants} 
          searchable={true} 
          exportable={true} 
        />
      )}

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
