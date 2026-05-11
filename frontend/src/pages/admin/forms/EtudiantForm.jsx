import React, { useState, useEffect } from 'react';
import './Form.css';

const EtudiantForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    filiere: 'Informatique',
    niveau: 'L1',
    statut: 'Validée',
    email: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="custom-form">
      <div className="form-grid">
        <div className="input-group">
          <label>Matricule</label>
          <input type="text" name="matricule" value={formData.matricule} onChange={handleChange} required placeholder="Ex: ETU-26-001" disabled={!!initialData} />
        </div>
        
        <div className="input-group">
          <label>Statut</label>
          <select name="statut" value={formData.statut} onChange={handleChange}>
            <option value="Validée">Validée</option>
            <option value="En attente">En attente</option>
            <option value="Suspendu">Suspendu</option>
            <option value="Annulée">Annulée</option>
          </select>
        </div>

        <div className="input-group">
          <label>Nom</label>
          <input type="text" name="nom" value={formData.nom} onChange={handleChange} required placeholder="Nom de famille" />
        </div>

        <div className="input-group">
          <label>Prénom</label>
          <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required placeholder="Prénom" />
        </div>

        <div className="input-group">
          <label>Filière</label>
          <select name="filiere" value={formData.filiere} onChange={handleChange}>
            <option value="Informatique">Informatique</option>
            <option value="Mathématiques">Mathématiques</option>
            <option value="Physique">Physique</option>
            <option value="Chimie">Chimie</option>
          </select>
        </div>

        <div className="input-group">
          <label>Niveau</label>
          <select name="niveau" value={formData.niveau} onChange={handleChange}>
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
            <option value="M1">M1</option>
            <option value="M2">M2</option>
          </select>
        </div>
        
        <div className="input-group full-width">
          <label>Email Universitaire (Optionnel)</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="nom.prenom@universite.edu" />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="flup-btn" onClick={onCancel}>Annuler</button>
        <button type="submit" className="flup-btn flup-btn--primary">{initialData ? 'Mettre à jour' : 'Ajouter l\'étudiant'}</button>
      </div>
    </form>
  );
};

export default EtudiantForm;
