import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Key } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import EtudiantForm from './forms/EtudiantForm';
import etudiantService from '../../services/etudiantService';
import authService from '../../services/authService';

const EtudiantsList = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEtudiant, setEditingEtudiant] = useState(null);

  // États pour la création de compte
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [selectedEtudiant, setSelectedEtudiant] = useState(null);
  const [accountPassword, setAccountPassword] = useState('');

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

  const handleOpenModal = (etudiant = null) => {
    setEditingEtudiant(etudiant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEtudiant(null);
  };

  const handleOpenAccountModal = (etudiant) => {
    setSelectedEtudiant(etudiant);
    setAccountPassword('');
    setIsAccountModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingEtudiant) {
        const matricule = editingEtudiant.matricule;
        const response = await etudiantService.update(matricule, formData);
        if (response.success) {
          fetchEtudiants();
        } else {
          alert(response.erreur || "Erreur lors de la mise à jour de l'étudiant.");
        }
      } else {
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

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    if (!accountPassword) {
      alert("Veuillez saisir un mot de passe.");
      return;
    }
    
    // Fonction utilitaire pour nettoyer les chaînes (accents, espaces)
    const cleanStr = (str) => {
      if (!str) return "";
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
    };

    const baseName = `${cleanStr(selectedEtudiant.prenom)}.${cleanStr(selectedEtudiant.nom)}`;
    const domain = "univ.edu"; // Sigle de l'université
    
    let currentEmail = `${baseName}@${domain}`;
    let counter = 1;
    let isCreated = false;

    while (!isCreated && counter <= 20) {
      try {
        const payload = {
          email: currentEmail,
          password: accountPassword,
          role: "ETUDIANT",
          idProfil: selectedEtudiant.matricule
        };
        const response = await authService.register(payload);
        if (response.success) {
          alert(`Compte utilisateur créé avec succès !\nIdentifiant : ${currentEmail}`);
          setIsAccountModalOpen(false);
          isCreated = true;
        } else {
          if (response.erreur === "Cet email est déjà utilisé") {
            currentEmail = `${baseName}${counter}@${domain}`;
            counter++;
          } else {
            alert(response.erreur || "Erreur lors de la création du compte.");
            break;
          }
        }
      } catch (err) {
        alert(err.erreur || "Erreur réseau lors de la création du compte.");
        break;
      }
    }
  };

  const handleDelete = (matricule) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet étudiant ? Cette action est irréversible.")) {
      etudiantService.delete(matricule).then(response => {
        if (response.success) fetchEtudiants();
        else alert(response.erreur || "Erreur lors de la suppression de l'étudiant.");
      }).catch(err => {
        alert(err.erreur || "Erreur réseau lors de la suppression.");
      });
    }
  };

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
            onClick={() => handleOpenAccountModal(row)}
            title="Créer un compte d'accès"
            style={{ padding: '6px 10px', color: 'var(--flup-primary)' }}
          >
            <Key size={14} />
          </button>
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

      {/* Modale de création de compte */}
      <Modal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        title="Créer un accès utilisateur"
      >
        {selectedEtudiant && (
          <form onSubmit={handleAccountSubmit} className="custom-form">
            <p style={{ marginBottom: '16px', color: 'var(--flup-text-secondary)', fontSize: '14px' }}>
              Un email institutionnel (type <em>prenom.nom@univ.edu</em>) sera automatiquement généré pour <strong>{selectedEtudiant.prenom} {selectedEtudiant.nom}</strong>. S'il existe déjà, un numéro y sera ajouté.
            </p>
            <div className="form-grid">
              <div className="input-group full-width">
                <label className="flup-label" style={{ fontWeight: 600 }}>Mot de passe initial</label>
                <input 
                  type="password" 
                  value={accountPassword} 
                  onChange={(e) => setAccountPassword(e.target.value)} 
                  required 
                  placeholder="Définir le mot de passe" 
                />
              </div>
            </div>
            <div className="form-actions" style={{ gridColumn: '1 / -1', marginTop: '24px' }}>
              <button type="button" className="flup-btn" onClick={() => setIsAccountModalOpen(false)}>Annuler</button>
              <button type="submit" className="flup-btn flup-btn--primary">Créer l'accès</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default EtudiantsList;
