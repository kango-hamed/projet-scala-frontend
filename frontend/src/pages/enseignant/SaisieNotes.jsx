import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import './SaisieNotes.css';

const initialStudents = [
  { id: 1, matricule: 'ETU-26-001', nom: 'Dupont Alice', cc: 14, examen: 12 },
  { id: 2, matricule: 'ETU-26-002', nom: 'Martin Lucas', cc: 8, examen: 9 },
  { id: 3, matricule: 'ETU-26-003', nom: 'Bernard Sophie', cc: 18, examen: 16 },
  { id: 4, matricule: 'ETU-26-004', nom: 'Thomas Hugo', cc: '', examen: '' },
  { id: 5, matricule: 'ETU-26-005', nom: 'Petit Emma', cc: 6, examen: 4 },
];

const SaisieNotes = () => {
  const [grades, setGrades] = useState(initialStudents);
  const [selectedMatiere, setSelectedMatiere] = useState('Algorithmique L1');
  const [saved, setSaved] = useState(false);

  // Formule exigée : 40% CC + 60% Examen
  const calculateMoyenne = (cc, examen) => {
    if (cc === '' || examen === '') return null;
    const numCC = parseFloat(cc);
    const numExamen = parseFloat(examen);
    if (isNaN(numCC) || isNaN(numExamen)) return null;
    return ((numCC * 0.4) + (numExamen * 0.6)).toFixed(2);
  };

  const getDecision = (moyenne) => {
    if (moyenne === null) return null;
    const num = parseFloat(moyenne);
    if (num >= 10) return 'Admis';
    if (num >= 8) return 'Redoublement'; // ou Rattrapage
    return 'Ajourné';
  };

  const handleGradeChange = (id, field, value) => {
    setSaved(false); // Le tableau n'est plus sauvegardé

    let parsedValue = value;
    if (value !== '') {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) parsedValue = '';
      if (parsedValue > 20) parsedValue = 20; // Blocage à 20 max
      if (parsedValue < 0) parsedValue = 0;   // Blocage à 0 min
    }

    setGrades(grades.map(student => {
      if (student.id === id) {
        return { ...student, [field]: value === '' ? '' : parsedValue };
      }
      return student;
    }));
  };

  const handleSave = () => {
    // Ici on ferait un appel API réel (axios.post...)
    setSaved(true);
    setTimeout(() => setSaved(false), 3000); // Disparaît après 3s
  };

  const hasMissingNotes = grades.some(g => g.cc === '' || g.examen === '');

  return (
    <div className="saisie-notes-container">
      <div className="saisie-header">
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Grille de saisie</h2>
          <select 
            value={selectedMatiere} 
            onChange={(e) => setSelectedMatiere(e.target.value)}
            className="matiere-selector"
          >
            <option value="Algorithmique L1">Algorithmique - L1 Informatique</option>
            <option value="Base de données L2">Bases de données - L2 Informatique</option>
            <option value="Maths Appliquées M1">Mathématiques Appliquées - M1</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {hasMissingNotes && (
            <div className="alert-missing">
              <AlertCircle size={18} />
              <span>Notes manquantes détectées</span>
            </div>
          )}
          <button className={`btn-save ${saved ? 'saved' : ''}`} onClick={handleSave}>
            <Save size={20} />
            {saved ? 'Enregistré avec succès !' : 'Enregistrer la grille'}
          </button>
        </div>
      </div>

      <div className="spreadsheet-container glass-effect">
        <table className="spreadsheet-table">
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Nom & Prénom</th>
              <th className="text-center">Contrôle Continu (40%)</th>
              <th className="text-center">Examen Final (60%)</th>
              <th className="text-center">Moyenne Générale / 20</th>
              <th>Décision</th>
            </tr>
          </thead>
          <tbody>
            {grades.map(student => {
              const moyenne = calculateMoyenne(student.cc, student.examen);
              const decision = getDecision(moyenne);
              
              return (
                <tr key={student.id}>
                  <td className="readonly-cell text-secondary font-medium">{student.matricule}</td>
                  <td className="readonly-cell font-medium">{student.nom}</td>
                  <td className="input-cell">
                    <input 
                      type="number" 
                      min="0" 
                      max="20" 
                      step="0.25"
                      value={student.cc}
                      onChange={(e) => handleGradeChange(student.id, 'cc', e.target.value)}
                      className={student.cc === '' ? 'missing-note' : ''}
                      placeholder="--"
                    />
                  </td>
                  <td className="input-cell">
                    <input 
                      type="number" 
                      min="0" 
                      max="20" 
                      step="0.25"
                      value={student.examen}
                      onChange={(e) => handleGradeChange(student.id, 'examen', e.target.value)}
                      className={student.examen === '' ? 'missing-note' : ''}
                      placeholder="--"
                    />
                  </td>
                  <td className={`readonly-cell text-center font-bold ${moyenne && moyenne < 10 ? 'text-danger' : 'text-success'}`}>
                    {moyenne !== null ? moyenne : '--'}
                  </td>
                  <td className="readonly-cell">
                    {decision ? <StatusBadge status={decision} /> : <span className="text-secondary">En attente</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SaisieNotes;
