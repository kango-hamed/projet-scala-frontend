import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Filter } from 'lucide-react';
import WeekCalendar from '../../components/common/WeekCalendar';
import Modal from '../../components/common/Modal';
import emploiDuTempsService from '../../services/emploiDuTempsService';
import formationService from '../../services/formationService';
import enseignantService from '../../services/enseignantService';

const EmploiDuTemps = () => {
  const [seances, setSeances] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [arbreFormation, setArbreFormation] = useState([]);
  const [formations, setFormations] = useState([]); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // États pour les sélections en cascade
  const [selectedNiveau, setSelectedNiveau] = useState('');
  const [selectedSemestre, setSelectedSemestre] = useState('');

  const [formData, setFormData] = useState({
    jour: '0',
    heureDebut: '0',
    idMatiere: '',
    idSalle: '',
    nbSemaines: 8,
    color: 'event-blue'
  });

  // Filtre d'affichage global
  const [filterFiliere, setFilterFiliere] = useState('');

  // Initial load for formations
  useEffect(() => {
    const initFormations = async () => {
      try {
        const res = await formationService.getAll();
        if (res && res.data && res.data.data) {
          const loadedFormations = res.data.data;
          setFormations(loadedFormations);
          if (loadedFormations.length > 0) {
            setFilterFiliere(loadedFormations[0].idFormation || loadedFormations[0].id);
          }
        } else if (res && res.data) {
          const loadedFormations = Array.isArray(res.data) ? res.data : (res.data.data || []);
          setFormations(loadedFormations);
          if (loadedFormations.length > 0) {
            setFilterFiliere(loadedFormations[0].idFormation || loadedFormations[0].id);
          }
        }
      } catch (err) {
        console.error("Erreur chargement formations", err);
      }
    };
    initFormations();
  }, []);

  useEffect(() => {
    if (filterFiliere) {
      fetchData();
    }
  }, [filterFiliere]);

  const fetchData = async () => {
    if (!filterFiliere) return;
    try {
      const [seancesRes, enseignantsRes, arbreRes] = await Promise.all([
        emploiDuTempsService.getByFiliere(filterFiliere),
        enseignantService.getAll(),
        formationService.getArbre(filterFiliere).catch(() => ({ data: [] }))
      ]);

      if (seancesRes.success) setSeances(seancesRes.data);
      if (enseignantsRes.success) setEnseignants(enseignantsRes.data);
      if (arbreRes.data) {
        const arbre = Array.isArray(arbreRes.data) ? arbreRes.data : (arbreRes.data.data || []);
        setArbreFormation(arbre);
        
        if (arbre.length > 0) {
          const firstNiveau = arbre[0].niveau.nom;
          setSelectedNiveau(firstNiveau);
          if (arbre[0].semestres.length > 0) {
            setSelectedSemestre(arbre[0].semestres[0].semestre.id);
          }
        }
      }
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNiveauChange = (e) => {
    const niv = e.target.value;
    setSelectedNiveau(niv);
    
    const niveauObj = arbreFormation.find(n => n.niveau.nom === niv);
    if (niveauObj && niveauObj.semestres && niveauObj.semestres.length > 0) {
      setSelectedSemestre(niveauObj.semestres[0].semestre.id);
    } else {
      setSelectedSemestre('');
    }
    setFormData(prev => ({ ...prev, idMatiere: '' }));
  };

  const handleSemestreChange = (e) => {
    setSelectedSemestre(e.target.value);
    setFormData(prev => ({ ...prev, idMatiere: '' }));
  };

  const handleMatiereChange = (e) => {
    setFormData(prev => ({ ...prev, idMatiere: e.target.value }));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      // Find matiere to auto-assign enseignant
      const matiereObj = availableMatieres.find(m => m.id === formData.idMatiere);
      const enseignantId = matiereObj ? matiereObj.idEnseignant : "";

      const payload = { 
        ...formData,
        idEnseignant: enseignantId,
        heureFin: (parseInt(formData.heureDebut, 10) + 1).toString(),
        nbSemaines: parseInt(formData.nbSemaines, 10),
        filiere: filterFiliere,
        niveau: selectedNiveau,
        idSemestre: selectedSemestre
      };
      
      const response = await emploiDuTempsService.create(payload);
      
      if (response.success) {
        setIsModalOpen(false);
        fetchData();
        setFormData(prev => ({ ...prev, jour: '0', heureDebut: '0', idMatiere: '', idSalle: '' }));
      } else {
        alert(response.erreur || "Erreur lors de la création.");
      }
    } catch (err) {
      alert(err.erreur || "Erreur lors de la création de la séance.");
    }
  };

  // Niveaux et Semestres
  const availableNiveaux = useMemo(() => arbreFormation.map(n => n.niveau), [arbreFormation]);
  const availableSemestres = useMemo(() => {
    const niveauObj = arbreFormation.find(n => n.niveau.nom === selectedNiveau);
    return niveauObj ? niveauObj.semestres.map(s => s.semestre) : [];
  }, [arbreFormation, selectedNiveau]);

  const availableMatieres = useMemo(() => {
    const niveauObj = arbreFormation.find(n => n.niveau.nom === selectedNiveau);
    if (!niveauObj) return [];
    const semestreObj = niveauObj.semestres.find(s => s.semestre.id === selectedSemestre);
    if (!semestreObj) return [];
    return semestreObj.ues.flatMap(ue => ue.matieres || []);
  }, [arbreFormation, selectedNiveau, selectedSemestre]);

  const allMatieresInArbre = useMemo(() => {
    return arbreFormation.flatMap(n => 
      n.semestres.flatMap(s => 
        s.ues.flatMap(ue => ue.matieres || [])
      )
    );
  }, [arbreFormation]);

  // Seulement les séances du semestre sélectionné
  const seancesSemestre = useMemo(() => {
    return seances.filter(s => s.idSemestre === selectedSemestre);
  }, [seances, selectedSemestre]);

  const calendarEvents = useMemo(() => {
    return seancesSemestre.map(s => {
      const mat = allMatieresInArbre.find(m => m.id === s.idMatiere);
      const ens = enseignants.find(e => e.idEnseignant === s.idEnseignant || e.id === s.idEnseignant);
      
      const colors = ['event-blue', 'event-green', 'event-orange', 'event-purple', 'event-pink'];
      const colorIndex = (s.idMatiere.length || 0) % colors.length;

      return {
        day: parseInt(s.jour, 10),
        start: parseInt(s.heureDebut, 10),
        title: mat ? mat.nom : s.idMatiere,
        room: `Salle: ${s.idSalle} (${s.nbSemaines} sem)`,
        prof: ens ? `${ens.prenom} ${ens.nom}` : s.idEnseignant,
        color: colors[colorIndex]
      };
    });
  }, [seancesSemestre, allMatieresInArbre, enseignants]);

  // --- Suivi des Quotas ---
  // Calcule le nombre d'heures planifiées par matière
  const quotas = useMemo(() => {
    const stats = {};
    availableMatieres.forEach(m => {
      stats[m.id] = { nom: m.nom, volumeHoraire: m.volumeHoraire || 0, planifie: 0 };
    });
    
    seancesSemestre.forEach(s => {
      if (stats[s.idMatiere]) {
        // Chaque slot dure 2 heures dans le WeekCalendar (ex: 8h-10h). 
        // Heures = 2h * nbSemaines
        const heures = 2 * (s.nbSemaines || 1);
        stats[s.idMatiere].planifie += heures;
      }
    });

    return Object.values(stats);
  }, [availableMatieres, seancesSemestre]);

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="flup-h1">Emploi du Temps Universitaire</h1>
          <p className="flup-label" style={{ marginTop: '8px' }}>Gestion par quotas d'heures sur un semestre type</p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--flup-bg-light)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--flup-border)' }}>
            <Filter size={16} color="var(--flup-text-secondary)" />
            <select 
              value={filterFiliere} 
              onChange={(e) => setFilterFiliere(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: 500 }}
            >
              {formations.map(f => (
                <option key={f.idFormation || f.id} value={f.idFormation || f.id}>
                  {f.nomFormation || f.nom}
                </option>
              ))}
              {formations.length === 0 && <option value="">Chargement...</option>}
            </select>
          </div>
          
          <button className="flup-btn flup-btn--primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Planifier un cours
          </button>
        </div>
      </div>

      {/* Zone de sélection du scope (Niveau + Semestre) et tableau des quotas */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
        <div className="glass-effect" style={{ flex: '1', padding: '16px', borderRadius: '12px' }}>
          <h3 className="flup-h3" style={{ marginBottom: '16px' }}>Contexte de planification</h3>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: '1' }}>
              <label className="flup-label">Niveau d'étude</label>
              <select value={selectedNiveau} onChange={handleNiveauChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--flup-border)', outline: 'none', marginTop: '6px' }}>
                {availableNiveaux.map(n => <option key={n.nom} value={n.nom}>{n.nom}</option>)}
              </select>
            </div>
            <div style={{ flex: '1' }}>
              <label className="flup-label">Semestre</label>
              <select value={selectedSemestre} onChange={handleSemestreChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--flup-border)', outline: 'none', marginTop: '6px' }}>
                {availableSemestres.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="glass-effect" style={{ flex: '2', padding: '16px', borderRadius: '12px' }}>
          <h3 className="flup-h3" style={{ marginBottom: '16px' }}>Quotas d'heures (Semestre en cours)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {quotas.map(q => {
              const progress = q.volumeHoraire > 0 ? Math.min(100, (q.planifie / q.volumeHoraire) * 100) : 0;
              const isOver = q.planifie > q.volumeHoraire;
              return (
                <div key={q.nom} style={{ background: 'var(--flup-bg-light)', padding: '10px', borderRadius: '8px', border: `1px solid ${isOver ? 'var(--flup-danger)' : 'var(--flup-border)'}` }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.nom}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--flup-text-secondary)', marginBottom: '4px' }}>
                    <span>{q.planifie}h planifiées</span>
                    <span>{q.volumeHoraire}h req.</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--flup-border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: isOver ? 'var(--flup-danger)' : 'var(--flup-primary)', transition: 'width 0.3s ease' }}></div>
                  </div>
                </div>
              );
            })}
            {quotas.length === 0 && <p className="flup-label">Aucune matière pour ce semestre.</p>}
          </div>
        </div>
      </div>

      <WeekCalendar events={calendarEvents} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Planifier une séance">
        <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="flup-label">Matière à planifier</label>
            <select name="idMatiere" value={formData.idMatiere} onChange={handleMatiereChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--flup-border)', outline: 'none' }}>
              <option value="">-- Sélectionner une matière --</option>
              {availableMatieres.map(m => (
                <option key={m.id} value={m.id}>
                  {m.nom} ({m.ue}) - Auto assigné: {enseignants.find(e => e.id === m.idEnseignant)?.nom || 'Aucun prof'}
                </option>
              ))}
            </select>
            <span style={{ fontSize: '12px', color: 'var(--flup-text-secondary)' }}>L'enseignant est automatiquement déduit de la matière.</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="flup-label">Jour de la semaine</label>
              <select name="jour" value={formData.jour} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--flup-border)', outline: 'none' }}>
                <option value="0">Lundi</option>
                <option value="1">Mardi</option>
                <option value="2">Mercredi</option>
                <option value="3">Jeudi</option>
                <option value="4">Vendredi</option>
                <option value="5">Samedi</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="flup-label">Créneau (2 heures)</label>
              <select name="heureDebut" value={formData.heureDebut} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--flup-border)', outline: 'none' }}>
                <option value="0">08:00 - 10:00</option>
                <option value="1">10:00 - 12:00</option>
                <option value="2">12:00 - 14:00</option>
                <option value="3">14:00 - 16:00</option>
                <option value="4">16:00 - 18:00</option>
                <option value="5">18:00 - 20:00</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="flup-label">Salle</label>
              <input type="text" name="idSalle" value={formData.idSalle} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--flup-border)', outline: 'none' }} placeholder="Ex: Amphi A" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="flup-label">Répétition (Semaines)</label>
              <input type="number" name="nbSemaines" min="1" max="16" value={formData.nbSemaines} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--flup-border)', outline: 'none' }} />
              <span style={{ fontSize: '11px', color: 'var(--flup-text-secondary)' }}>Combien de semaines ce créneau se répète-t-il dans le semestre ?</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" className="flup-btn" onClick={() => setIsModalOpen(false)}>Annuler</button>
            <button type="submit" className="flup-btn flup-btn--primary">Valider la séance</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmploiDuTemps;
