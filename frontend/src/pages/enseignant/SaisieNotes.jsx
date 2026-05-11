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
    if (num >= 8) return 'Redoublement';
    return 'Ajourné';
  };

  const handleGradeChange = (id, field, value) => {
    setSaved(false);

    let parsedValue = value;
    if (value !== '') {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) parsedValue = '';
      if (parsedValue > 20) parsedValue = 20;
      if (parsedValue < 0) parsedValue = 0;
    }

    setGrades(grades.map(student => {
      if (student.id === id) {
        return { ...student, [field]: value === '' ? '' : parsedValue };
      }
      return student;
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const hasMissingNotes = grades.some(g => g.cc === '' || g.examen === '');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
        <div>
          <h1 className="flup-h1" style={{ marginBottom: '16px' }}>Grille de saisie</h1>
          <select 
            value={selectedMatiere} 
            onChange={(e) => setSelectedMatiere(e.target.value)}
            className="flup-input-select"
            style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--flup-border)', outline: 'none', background: 'var(--flup-surface)', minWidth: '300px' }}
          >
            <option value="Algorithmique L1">Algorithmique - L1 Informatique</option>
            <option value="Base de données L2">Bases de données - L2 Informatique</option>
            <option value="Maths Appliquées M1">Mathématiques Appliquées - M1</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {hasMissingNotes && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--flup-danger)', background: 'var(--flup-danger-bg)', padding: '8px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>
              <AlertCircle size={16} />
              <span>Notes manquantes</span>
            </div>
          )}
          <button className={`flup-btn ${saved ? '' : 'flup-btn--primary'}`} onClick={handleSave} style={saved ? { pointerEvents: 'none', background: 'var(--flup-success-bg)', color: 'var(--flup-success)', borderColor: 'transparent' } : {}}>
            <Save size={16} />
            {saved ? 'Enregistré' : 'Enregistrer'}
          </button>
        </div>
      </div>

      <div className="flup-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="flup-table spreadsheet-table">
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Nom & Prénom</th>
              <th className="text-center">Contrôle Continu (40%)</th>
              <th className="text-center">Examen Final (60%)</th>
              <th className="text-center">Moyenne / 20</th>
              <th>Décision</th>
            </tr>
          </thead>
          <tbody>
            {grades.map(student => {
              const moyenne = calculateMoyenne(student.cc, student.examen);
              const decision = getDecision(moyenne);
              
              return (
                <tr key={student.id}>
                  <td className="readonly-cell" style={{ color: 'var(--flup-text-secondary)', fontWeight: 600 }}>{student.matricule}</td>
                  <td className="readonly-cell" style={{ fontWeight: 500 }}>{student.nom}</td>
                  <td className="input-cell">
                    <input 
                      type="number" min="0" max="20" step="0.25"
                      value={student.cc}
                      onChange={(e) => handleGradeChange(student.id, 'cc', e.target.value)}
                      className={student.cc === '' ? 'missing-note flup-mono' : 'flup-mono'}
                      placeholder="--"
                    />
                  </td>
                  <td className="input-cell">
                    <input 
                      type="number" min="0" max="20" step="0.25"
                      value={student.examen}
                      onChange={(e) => handleGradeChange(student.id, 'examen', e.target.value)}
                      className={student.examen === '' ? 'missing-note flup-mono' : 'flup-mono'}
                      placeholder="--"
                    />
                  </td>
                  <td className="readonly-cell text-center flup-mono" style={{ fontWeight: 700, color: moyenne && moyenne < 10 ? 'var(--flup-danger)' : 'var(--flup-success)' }}>
                    {moyenne !== null ? moyenne : '--'}
                  </td>
                  <td className="readonly-cell">
                    {decision ? <StatusBadge status={decision} /> : <span style={{ color: 'var(--flup-text-muted)', fontSize: '13px' }}>En attente</span>}
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
