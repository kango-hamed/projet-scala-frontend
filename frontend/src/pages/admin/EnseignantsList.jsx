import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import '../admin/forms/Form.css'; // On réutilise les styles de formulaire

const initialEnseignants = [
  { id: 1, matricule: 'ENS-26-001', nom: 'Martin', prenom: 'Paul', specialite: 'Informatique', email: 'paul.martin@univ.edu' },
  { id: 2, matricule: 'ENS-26-002', nom: 'Dupont', prenom: 'Marie', specialite: 'Mathématiques', email: 'marie.dupont@univ.edu' },
  { id: 3, matricule: 'ENS-26-003', nom: 'Bernard', prenom: 'Jean', specialite: 'Physique', email: 'jean.bernard@univ.edu' },
];

const EnseignantsList = () => {
  const [enseignants, setEnseignants] = useState(initialEnseignants);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    matricule: '', nom: '', prenom: '', specialite: 'Informatique', email: ''
  });

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet enseignant ? Cette action est irréversible.')) {
      setEnseignants(enseignants.filter(e => e.id !== id));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const newEns = { ...formData, id: Date.now() };
    setEnseignants([newEns, ...enseignants]);
    setIsModalOpen(false);
    setFormData({ matricule: '', nom: '', prenom: '', specialite: 'Informatique', email: '' });
  };

  const columns = [
    { key: 'matricule', label: 'Matricule', render: (val) => <span style={{fontWeight: 600}}>{val}</span> },
    { key: 'nom', label: 'Nom' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'specialite', label: 'Spécialité', render: (val) => <span className="flup-badge" style={{background: 'var(--flup-bg)', color: 'var(--flup-text-secondary)'}}>{val}</span> },
    { key: 'email', label: 'Email Universitaire' },
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

      <DataTable columns={columns} data={enseignants} searchable={true} exportable={true} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter un enseignant">
        <form onSubmit={handleAdd} className="custom-form">
          <div className="form-grid">
            <div className="input-group">
              <label className="flup-label" style={{fontWeight: 600}}>Matricule</label>
              <input type="text" name="matricule" value={formData.matricule} onChange={handleChange} required placeholder="Ex: ENS-26-004" />
            </div>
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
              <label className="flup-label" style={{fontWeight: 600}}>Email Universitaire</label>
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
