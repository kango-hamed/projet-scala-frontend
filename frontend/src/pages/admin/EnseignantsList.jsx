import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import enseignantService from '../../services/enseignantService';
import '../admin/forms/Form.css'; // On réutilise les styles de formulaire

const EnseignantsList = () => {
  const [enseignants, setEnseignants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: '', prenom: '', specialite: 'Informatique', email: ''
  });

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

  const handleDelete = (id) => {
    alert("L'API ne supporte pas actuellement la suppression physique d'un enseignant.");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await enseignantService.create(formData);
      if (response.success) {
        fetchEnseignants();
        setIsModalOpen(false);
        setFormData({ nom: '', prenom: '', specialite: 'Informatique', email: '' });
      } else {
        alert(response.erreur || "Erreur lors de la création de l'enseignant.");
      }
    } catch (err) {
      alert(err.erreur || "Erreur réseau lors de la validation du formulaire.");
    }
  };

  const columns = [
    { key: 'id', label: 'ID / Matricule', render: (val, row) => <span style={{fontWeight: 600}}>{row.matricule || row.id || val}</span> },
    { key: 'nom', label: 'Nom' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'specialite', label: 'Spécialité', render: (val) => <span className="flup-badge" style={{background: 'var(--flup-bg)', color: 'var(--flup-text-secondary)'}}>{val || 'N/A'}</span> },
    { key: 'email', label: 'Email' },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <button 
          className="flup-btn"
          onClick={() => handleDelete(row.id)}
          title="Supprimer"
          style={{ padding: '6px 10px', color: 'var(--flup-danger)' }}
        >
          <Trash2 size={14} /> Supprimer
        </button>
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
            <div className="input-group full-width">
              <label className="flup-label" style={{fontWeight: 600}}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="nom.prenom@univ.edu" />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="flup-btn" onClick={() => setIsModalOpen(false)}>Annuler</button>
            <button type="submit" className="flup-btn flup-btn--primary">Valider l'ajout</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EnseignantsList;
