import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import enseignantService from '../../services/enseignantService';
import scolariteService from '../../services/scolariteService';
import './SaisieNotes.css';

const SaisieNotes = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Cours
  const [coursList, setCoursList] = useState([]);
  const [selectedCoursId, setSelectedCoursId] = useState(location.state?.coursId || '');
  const [selectedCoursNom, setSelectedCoursNom] = useState(location.state?.coursNom || '');

  // Étudiants / notes
  const [grades, setGrades] = useState([]);

  // États UI
  const [loadingCours, setLoadingCours] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);

  // ─── 1. Charger la liste des cours de l'enseignant ───────────────────────
  useEffect(() => {
    const fetchCours = async () => {
      const enseignantId = user?.idProfil ?? user?.idEnseignant ?? user?.enseignantId ?? user?.id;
      console.log('[SaisieNotes] user object:', user);
      console.log('[SaisieNotes] enseignantId utilisé:', enseignantId);

      if (!enseignantId) {
        setError('Impossible de déterminer votre identifiant enseignant.');
        setLoadingCours(false);
        return;
      }
      try {
        setLoadingCours(true);
        const response = await enseignantService.getCours(enseignantId);
        if (response.success) {
          const data = response.data || [];
          setCoursList(data);
          if (!selectedCoursId && data.length > 0) {
            setSelectedCoursId(data[0].id);
            setSelectedCoursNom(data[0].nom || data[0].ue || data[0].libelle || '');
          }
        } else {
          setError(response.erreur || 'Erreur lors du chargement des cours.');
        }
      } catch (err) {
        setError(err.erreur || 'Impossible de contacter le serveur.');
      } finally {
        setLoadingCours(false);
      }
    };

    fetchCours();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ─── 2. Quand le cours sélectionné change, vider les notes ───────────────
  useEffect(() => {
    // Ici on pourrait charger les étudiants inscrits au cours.
    // L'API actuelle ne fournit pas directement cet endpoint pour les enseignants.
    // On initialise donc la grille vide, prête à être remplie.
    setGrades([]);
    setSaved(false);
    setSaveError(null);
  }, [selectedCoursId]);

  // ─── 3. Helpers calcul ────────────────────────────────────────────────────
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

  // ─── 4. Modifier une note ─────────────────────────────────────────────────
  const handleGradeChange = (id, field, value) => {
    setSaved(false);
    setSaveError(null);

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

  // ─── 5. Ajouter une ligne d'étudiant manuellement ────────────────────────
  const handleAddRow = () => {
    setGrades(prev => [
      ...prev,
      { id: Date.now(), matricule: '', nom: '', cc: '', examen: '' }
    ]);
  };

  const handleMatriculeChange = (id, value) => {
    setGrades(grades.map(s => s.id === id ? { ...s, matricule: value } : s));
  };

  const handleNomChange = (id, value) => {
    setGrades(grades.map(s => s.id === id ? { ...s, nom: value } : s));
  };

  // ─── 6. Enregistrer (POST /api/notes pour chaque ligne complète) ──────────
  const handleSave = async () => {
    const completedGrades = grades.filter(
      g => g.matricule && (g.cc !== '' || g.examen !== '')
    );

    if (completedGrades.length === 0) {
      setSaveError('Aucune note à enregistrer. Remplissez au moins un matricule et une note.');
      return;
    }

    if (!selectedCoursId) {
      setSaveError('Veuillez sélectionner un cours avant d\'enregistrer.');
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);

      // On envoie une note par étudiant (selon le format API : POST /api/notes)
      const promises = completedGrades.map(g =>
        scolariteService.saisirNote({
          matricule: g.matricule,
          coursId: selectedCoursId,
          cc: g.cc !== '' ? parseFloat(g.cc) : undefined,
          examen: g.examen !== '' ? parseFloat(g.examen) : undefined,
        })
      );

      const results = await Promise.allSettled(promises);
      const failures = results.filter(r => r.status === 'rejected');

      if (failures.length === 0) {
        setSaved(true);
        setTimeout(() => setSaved(false), 4000);
      } else {
        const firstError = failures[0].reason?.erreur || 'Certaines notes n\'ont pas pu être enregistrées.';
        setSaveError(`${failures.length} erreur(s) : ${firstError}`);
      }
    } catch (err) {
      setSaveError(err.erreur || 'Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  const hasMissingNotes = grades.length > 0 && grades.some(g => g.cc === '' || g.examen === '');

  // ─── Rendu ────────────────────────────────────────────────────────────────
  if (loadingCours) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '16px', color: 'var(--flup-text-secondary)' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <p className="flup-label">Chargement des cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--flup-danger)', background: 'var(--flup-danger-bg)', padding: '16px 24px', borderRadius: '12px', fontWeight: 600 }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
        <div>
          <h1 className="flup-h1" style={{ marginBottom: '16px' }}>Grille de saisie</h1>

          {/* Select des cours chargé depuis l'API */}
          <select
            value={selectedCoursId}
            onChange={(e) => {
              const chosen = coursList.find(c => String(c.id) === e.target.value);
              setSelectedCoursId(e.target.value);
              setSelectedCoursNom(chosen ? (chosen.nom || chosen.ue || chosen.libelle || '') : '');
            }}
            className="flup-input-select"
            style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--flup-border)', outline: 'none', background: 'var(--flup-surface)', minWidth: '300px' }}
          >
            {coursList.length === 0 && <option value="">Aucun cours disponible</option>}
            {coursList.map((c) => {
              const label = `${c.nom || c.ue || c.libelle || `Cours ${c.id}`}${c.niveau || c.filiere ? ` — ${c.niveau || c.filiere}` : ''}`;
              return (
                <option key={c.id} value={c.id}>{label}</option>
              );
            })}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Alerte notes manquantes */}
          {hasMissingNotes && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--flup-danger)', background: 'var(--flup-danger-bg)', padding: '8px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>
              <AlertCircle size={16} />
              <span>Notes manquantes</span>
            </div>
          )}

          {/* Alerte erreur de sauvegarde */}
          {saveError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--flup-danger)', background: 'var(--flup-danger-bg)', padding: '8px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, maxWidth: '300px' }}>
              <AlertCircle size={16} />
              <span>{saveError}</span>
            </div>
          )}

          {/* Bouton Enregistrer */}
          <button
            className={`flup-btn ${saved ? '' : 'flup-btn--primary'}`}
            onClick={handleSave}
            disabled={saving || saved}
            style={
              saved
                ? { pointerEvents: 'none', background: 'var(--flup-success-bg)', color: 'var(--flup-success)', borderColor: 'transparent' }
                : {}
            }
          >
            {saving ? (
              <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Enregistrement...</>
            ) : saved ? (
              <><CheckCircle2 size={16} /> Enregistré</>
            ) : (
              <><Save size={16} /> Enregistrer</>
            )}
          </button>
        </div>
      </div>

      {/* Tableau de saisie */}
      <div className="flup-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="flup-table spreadsheet-table">
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Nom &amp; Prénom</th>
              <th className="text-center">Contrôle Continu (40%)</th>
              <th className="text-center">Examen Final (60%)</th>
              <th className="text-center">Moyenne / 20</th>
              <th>Décision</th>
            </tr>
          </thead>
          <tbody>
            {grades.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--flup-text-muted)' }}>
                  Cliquez sur « Ajouter un étudiant » pour commencer la saisie.
                </td>
              </tr>
            ) : (
              grades.map(student => {
                const moyenne = calculateMoyenne(student.cc, student.examen);
                const decision = getDecision(moyenne);

                return (
                  <tr key={student.id}>
                    <td className="input-cell">
                      <input
                        type="text"
                        value={student.matricule}
                        onChange={(e) => handleMatriculeChange(student.id, e.target.value)}
                        className="flup-mono"
                        placeholder="ETU-26-XXX"
                        style={{ fontWeight: 600, color: 'var(--flup-text-secondary)' }}
                      />
                    </td>
                    <td className="input-cell">
                      <input
                        type="text"
                        value={student.nom}
                        onChange={(e) => handleNomChange(student.id, e.target.value)}
                        placeholder="Nom Prénom"
                        style={{ fontWeight: 500 }}
                      />
                    </td>
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
                    <td className="readonly-cell text-center flup-mono" style={{ fontWeight: 700, color: moyenne && parseFloat(moyenne) < 10 ? 'var(--flup-danger)' : 'var(--flup-success)' }}>
                      {moyenne !== null ? moyenne : '--'}
                    </td>
                    <td className="readonly-cell">
                      {decision ? <StatusBadge status={decision} /> : <span style={{ color: 'var(--flup-text-muted)', fontSize: '13px' }}>En attente</span>}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Bouton ajouter une ligne */}
      <div style={{ marginTop: '16px' }}>
        <button
          className="flup-btn"
          onClick={handleAddRow}
          disabled={!selectedCoursId}
          style={{ color: 'var(--flup-text-secondary)' }}
        >
          + Ajouter un étudiant
        </button>
      </div>
    </div>
  );
};

export default SaisieNotes;
