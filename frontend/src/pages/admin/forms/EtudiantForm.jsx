import React, { useState, useEffect } from 'react';
import './Form.css';

const EtudiantForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    sexe: 'M',
    dateNaissance: '',
    filiere: 'Informatique',
    niveau: 'L1',
    annee: new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString(),
    statut: 'Actif',
    email: '',
    telephone: ''
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
    const payload = { ...formData };
    if (!payload.matricule) {
      payload.matricule = `ETU-${Date.now().toString().slice(-5)}`;
    }
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="custom-form">
      <div className="form-grid">
        {initialData && (
          <div className="input-group">
            <label>Matricule</label>
            <input type="text" name="matricule" value={formData.matricule} disabled={true} />
          </div>
        )}
        
        <div className="input-group">
          <label>Statut</label>
          <select name="statut" value={formData.statut} onChange={handleChange}>
            <option value="Actif">Actif</option>
            <option value="Suspendu">Suspendu</option>
            <option value="Diplome">Diplômé</option>
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
          <label>Sexe</label>
          <select name="sexe" value={formData.sexe} onChange={handleChange}>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
        </div>

        <div className="input-group">
          <label>Date de Naissance</label>
          <input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} required />
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

        <div className="input-group">
          <label>Année Universitaire</label>
          <input type="text" name="annee" value={formData.annee} onChange={handleChange} required placeholder="Ex: 2026-2027" />
        </div>

        <div className="input-group">
          <label>Téléphone</label>
          <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} required placeholder="06..." />
        </div>
        
        <div className="input-group full-width">
          <label>Email Universitaire</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="nom.prenom@universite.edu" />
        </div>
      </div>

      <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
        <button type="button" className="flup-btn" onClick={onCancel}>Annuler</button>
        <button type="submit" className="flup-btn flup-btn--primary">{initialData ? 'Mettre à jour' : 'Ajouter l\'étudiant'}</button>
      </div>
    </form>
  );
};

export default EtudiantForm;
