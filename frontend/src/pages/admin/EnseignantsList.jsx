import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Key } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import enseignantService from '../../services/enseignantService';
import authService from '../../services/authService';
import '../admin/forms/Form.css'; // On réutilise les styles de formulaire

const EnseignantsList = () => {
  const [enseignants, setEnseignants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    idEnseignant: '', nom: '', prenom: '', specialite: 'Informatique', email: '', grade: 'Professeur', departement: 'Informatique', telephone: ''
  });

  // États pour la création de compte
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [selectedEnseignant, setSelectedEnseignant] = useState(null);
  const [accountPassword, setAccountPassword] = useState('');

  useEffect(() => {
    fetchEnseignants();
  }, []);

  const fetchEnseignants = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await enseignantService.getAll();
      if (response.success) {
        setEnseignants(response.data || []);
      } else {
        setError(response.erreur || "Impossible de charger la liste des enseignants.");
      }
    } catch (err) {
      setError(err.erreur || "Erreur réseau lors du chargement des enseignants.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet enseignant ? Cette action est irréversible.")) {
      try {
        const response = await enseignantService.delete(id);
        if (response.success) {
          fetchEnseignants();
        } else {
          alert(response.erreur || "Erreur lors de la suppression de l'enseignant.");
        }
      } catch (err) {
        alert(err.erreur || "Erreur réseau lors de la suppression.");
      }
    }
  };

  const handleOpenAccountModal = (enseignant) => {
    setSelectedEnseignant(enseignant);
    setAccountPassword('');
    setIsAccountModalOpen(true);
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

    const baseName = `${cleanStr(selectedEnseignant.prenom)}.${cleanStr(selectedEnseignant.nom)}`;
    const domain = "univ.edu"; // Sigle de l'université
    
    let currentEmail = `${baseName}@${domain}`;
    let counter = 1;
    let isCreated = false;

    while (!isCreated && counter <= 20) {
      try {
        const payload = {
          email: currentEmail,
          password: accountPassword,
          role: "ENSEIGNANT",
          idProfil: selectedEnseignant.idEnseignant || selectedEnseignant.id
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      // Génération automatique d'un ID si non fourni par l'utilisateur
      const payload = { ...formData };
      if (!payload.idEnseignant || payload.idEnseignant.trim() === '') {
        payload.idEnseignant = `ENS-${Date.now().toString().slice(-5)}`;
      }

      const response = await enseignantService.create(payload);
      if (response.success) {
        fetchEnseignants();
        setIsModalOpen(false);
        setFormData({ idEnseignant: '', nom: '', prenom: '', specialite: 'Informatique', email: '', grade: 'Professeur', departement: 'Informatique', telephone: '' });
      } else {
        alert(response.erreur || "Erreur lors de la création de l'enseignant.");
      }
    } catch (err) {
      alert(err.erreur || "Erreur réseau lors de la validation du formulaire.");
    }
  };

  const columns = [
    { key: 'id', label: 'ID / Matricule', render: (val, row) => <span style={{fontWeight: 600}}>{row.idEnseignant || row.matricule || row.id || val}</span> },
    { key: 'nom', label: 'Nom' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'specialite', label: 'Spécialité', render: (val) => <span className="flup-badge" style={{background: 'var(--flup-bg)', color: 'var(--flup-text-secondary)'}}>{val || 'N/A'}</span> },
    { key: 'email', label: 'Email' },
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
            onClick={() => handleDelete(row.idEnseignant || row.id)}
            title="Supprimer"
            style={{ padding: '6px 10px', color: 'var(--flup-danger)' }}
          >
            <Trash2 size={14} /> Supprimer
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="flup-h1">Gestion des Enseignants</h1>
          <p className="flup-label" style={{ marginTop: '8px' }}>Liste du corps professoral</p>
        </div>
        <button className="flup-btn flup-btn--primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Nouvel Enseignant
        </button>
      </div>

      {error && (
        <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--flup-text-secondary)' }}>
          Chargement des enseignants en cours...
        </div>
      ) : (
        <DataTable columns={columns} data={enseignants} searchable={true} exportable={true} />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter un enseignant">
        <form onSubmit={handleAdd} className="custom-form">
          <div className="form-grid">
            {/* L'ID est généré automatiquement par l'API */}
            <div className="input-group">
              <label className="flup-label" style={{fontWeight: 600}}>Spécialité</label>
              <select name="specialite" value={formData.specialite} onChange={handleChange}>
                <option value="Informatique">Informatique</option>
                <option value="Mathématiques">Mathématiques</option>
                <option value="Physique">Physique</option>
                <option value="Langues">Langues</option>
              </select>
            </div>
            <div className="input-group">
              <label className="flup-label" style={{fontWeight: 600}}>Nom</label>
              <input type="text" name="nom" value={formData.nom} onChange={handleChange} required placeholder="Nom de famille" />
            </div>
            <div className="input-group">
              <label className="flup-label" style={{fontWeight: 600}}>Prénom</label>
              <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required placeholder="Prénom" />
            </div>
            <div className="input-group">
              <label className="flup-label" style={{fontWeight: 600}}>Grade</label>
              <input type="text" name="grade" value={formData.grade} onChange={handleChange} required placeholder="Ex: Professeur" />
            </div>
            <div className="input-group">
              <label className="flup-label" style={{fontWeight: 600}}>Département</label>
              <input type="text" name="departement" value={formData.departement} onChange={handleChange} required placeholder="Ex: Informatique" />
            </div>
            <div className="input-group">
              <label className="flup-label" style={{fontWeight: 600}}>Téléphone</label>
              <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} required placeholder="06..." />
            </div>
            <div className="input-group">
              <label className="flup-label" style={{fontWeight: 600}}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="nom.prenom@univ.edu" />
            </div>
          </div>
          <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
            <button type="button" className="flup-btn" onClick={() => setIsModalOpen(false)}>Annuler</button>
            <button type="submit" className="flup-btn flup-btn--primary">Valider l'ajout</button>
          </div>
        </form>
      </Modal>

      {/* Modale de création de compte */}
      <Modal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        title="Créer un accès utilisateur"
      >
        {selectedEnseignant && (
          <form onSubmit={handleAccountSubmit} className="custom-form">
            <p style={{ marginBottom: '16px', color: 'var(--flup-text-secondary)', fontSize: '14px' }}>
              Un email institutionnel (type <em>prenom.nom@univ.edu</em>) sera automatiquement généré pour <strong>{selectedEnseignant.prenom} {selectedEnseignant.nom}</strong>. S'il existe déjà, un numéro y sera ajouté.
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

export default EnseignantsList;
