import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Folder, FileText, Plus, PlusCircle, RefreshCw, Edit2, Trash2 } from 'lucide-react';
import Modal from '../../components/common/Modal';
import formationService from '../../services/formationService';
import './FormationsList.css';

const FormationsList = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('filiere'); 
  const [parentNodeId, setParentNodeId] = useState(null);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Étape 1 : Récupérer la liste des filières/formations
      const filieresRes = await formationService.getAll();
      if (filieresRes.success) {
        const filieres = filieresRes.data || [];
        
        // Étape 2 : Pour chaque filière, récupérer son arbre complet
        const fullTreePromises = filieres.map(async (filiere) => {
          const filiereId = filiere.idFormation || filiere.idFiliere || filiere.code || filiere;
          const filiereName = filiere.nomFormation || filiere.nomFiliere || filiere.nom || filiereId;
          try {
            const arbreRes = await formationService.getArbre(filiereId);
            if (arbreRes.success) {
              return {
                id: filiereId,
                name: filiereName,
                type: 'filiere',
                children: parseTreeFromBackend(arbreRes.data, filiereId)
              };
            }
          } catch (e) {
            console.warn(`Impossible de charger l'arbre pour la filière ${filiereId}`);
          }
          // Fallback en cas d'erreur
          return {
            id: filiereId,
            name: filiereName,
            type: 'filiere',
            children: []
          };
        });

        const fullTree = await Promise.all(fullTreePromises);
        setData(fullTree);
      } else {
        setError(filieresRes.erreur || "Impossible de charger les formations.");
      }
    } catch (err) {
      setError(err.erreur || "Erreur réseau lors de la communication avec l'API.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper pour adapter la structure de l'API à notre composant TreeNode
  const parseTreeFromBackend = (apiNodes, rootFiliereId) => {
    if (!apiNodes || !Array.isArray(apiNodes)) return [];
    
    return apiNodes.map((n) => ({
      id: n.niveau?.id || Math.random().toString(),
      name: n.niveau?.nom || 'Niveau Inconnu',
      type: 'niveau',
      filiere: n.niveau?.filiere || rootFiliereId,
      children: (n.semestres || []).map((s) => ({
        id: s.semestre?.id || Math.random().toString(),
        name: s.semestre?.nom || 'Semestre Inconnu',
        type: 'semestre',
        filiere: n.niveau?.filiere || rootFiliereId,
        idNiveau: n.niveau?.id,
        children: (s.ues || []).map((u) => ({
          id: u.id || Math.random().toString(),
          name: u.nom || 'UE Inconnue',
          type: 'ue',
          filiere: n.niveau?.filiere || rootFiliereId,
          idNiveau: n.niveau?.id,
          idSemestre: s.semestre?.id,
          children: (u.matieres || []).map((m) => ({
            id: m.idMatiere || m.id || Math.random().toString(),
            name: m.nomMatiere || m.nom || 'Matière Inconnue',
            type: 'matiere',
            volumeHoraire: m.volumeHoraire || 0,
            coefficient: m.coefficient || 1,
            ue: m.ue || u.id,
            idEnseignant: m.idEnseignant || "NON_AFFECTE",
            filiere: n.niveau?.filiere || rootFiliereId,
            idNiveau: n.niveau?.id,
            idSemestre: s.semestre?.id,
            children: []
          }))
        }))
      }))
    }));
  };

  const [isMatiereModalOpen, setIsMatiereModalOpen] = useState(false);
  const [isEditingMatiere, setIsEditingMatiere] = useState(false);
  const [matiereFormData, setMatiereFormData] = useState({ idMatiere: '', nomMatiere: '', volumeHoraire: '', coefficient: '', ue: '', idEnseignant: '' });
  const [parentNodeInfo, setParentNodeInfo] = useState(null);

  const handleOpenModal = (type, parentNode = null) => {
    if (type === 'matiere') {
      setParentNodeInfo(parentNode);
      setIsEditingMatiere(false);
      setMatiereFormData({ idMatiere: '', nomMatiere: '', volumeHoraire: '', coefficient: '', ue: parentNode?.id, idEnseignant: '' });
      setIsMatiereModalOpen(true);
    } else {
      setModalType(type);
      setParentNodeInfo(parentNode);
      setNewItemName('');
      setIsModalOpen(true);
    }
  };

  const handleEditMatiere = (node, e) => {
    e.stopPropagation();
    setMatiereFormData({
      idMatiere: node.id,
      nomMatiere: node.name,
      volumeHoraire: node.volumeHoraire,
      coefficient: node.coefficient,
      ue: node.ue,
      idEnseignant: node.idEnseignant
    });
    setIsEditingMatiere(true);
    setIsMatiereModalOpen(true);
  };

  const handleDeleteMatiere = async (node, e) => {
    e.stopPropagation();
    if (window.confirm(`Voulez-vous vraiment supprimer la matière ${node.name} ?`)) {
      try {
        const res = await formationService.deleteMatiere(node.id);
        if (res.success) {
          fetchFormations();
        } else {
          alert(res.erreur || "Erreur lors de la suppression.");
        }
      } catch (err) {
        alert(err.erreur || "Erreur réseau lors de la suppression.");
      }
    }
  };

  const submitMatiere = async (e) => {
    e.preventDefault();
    try {
      const vol = parseInt(matiereFormData.volumeHoraire);
      const coeff = parseInt(matiereFormData.coefficient);

      const payload = {
        idMatiere: matiereFormData.idMatiere || `MAT-${Date.now().toString().slice(-5)}`,
        nomMatiere: matiereFormData.nomMatiere,
        ue: matiereFormData.ue || parentNodeInfo?.id,
        volumeHoraire: isNaN(vol) ? 0 : vol,
        coefficient: isNaN(coeff) ? 1 : coeff,
        idEnseignant: matiereFormData.idEnseignant || "NON_AFFECTE"
      };

      let res;
      if (isEditingMatiere) {
        res = await formationService.updateMatiere(payload.idMatiere, payload);
      } else {
        res = await formationService.createMatiere(payload);
      }

      if (res.success) {
        fetchFormations();
        setIsMatiereModalOpen(false);
      } else {
        alert(res.erreur || "Erreur lors de l'enregistrement de la matière.");
      }
    } catch (err) {
      alert(err.erreur || "Erreur réseau.");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let res;
      if (modalType === 'filiere') {
        res = await formationService.createFormation({
          idFormation: `FIL-${Date.now().toString().slice(-4)}`,
          nomFormation: newItemName,
          description: "Nouvelle Filière",
          dureeAnnees: 3,
          responsable: "NON_AFFECTE"
        });
      } else if (modalType === 'niveau') {
        res = await formationService.createNiveau({
          idNiveau: `NIV-${Date.now().toString().slice(-4)}`,
          niveauEtudes: { nom: newItemName, ordre: 1 },
          filiere: parentNodeInfo?.id,
          semestres: []
        });
      } else if (modalType === 'semestre') {
        res = await formationService.createSemestre({
          idSemestre: `SEM-${Date.now().toString().slice(-4)}`,
          nomSemestre: newItemName,
          niveau: parentNodeInfo?.id,
          filiere: parentNodeInfo?.filiere,
          uniteEnseignements: []
        });
      } else if (modalType === 'ue') {
        res = await formationService.createUE({
          idUE: `UE-${Date.now().toString().slice(-4)}`,
          nomUE: newItemName,
          filiere: parentNodeInfo?.filiere,
          niveau: parentNodeInfo?.idNiveau,
          semestre: parentNodeInfo?.id,
          coefficientTotal: 1,
          matieres: []
        });
      }

      if (res && res.success) {
        setIsModalOpen(false);
        fetchFormations();
      } else {
        alert(res?.erreur || "Erreur lors de la création.");
        setIsLoading(false);
      }
    } catch (err) {
      alert(err.erreur || "Erreur réseau.");
      setIsLoading(false);
    }
  };

  const TreeNode = ({ node }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = node.children && node.children.length > 0;

    const nextTypeMap = { filiere: 'niveau', niveau: 'semestre', semestre: 'ue', ue: 'matiere' };
    const nextType = nextTypeMap[node.type];

    return (
      <div className="tree-node">
        <div className={`tree-node-content ${node.type}`}>
          <span className="tree-toggle" onClick={() => setIsOpen(!isOpen)}>
            {hasChildren ? (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />) : <span style={{width: 16, display: 'inline-block'}}></span>}
          </span>
          <span className="tree-icon" onClick={() => setIsOpen(!isOpen)}>
            {node.type === 'matiere' ? <FileText size={16} /> : <Folder size={16} />}
          </span>
          <span className="tree-label" onClick={() => setIsOpen(!isOpen)}>{node.name}</span>
          <span className="tree-badge">{node.type}</span>
          
          {node.type === 'matiere' && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
              <button className="flup-btn" style={{ padding: '4px', boxShadow: 'none' }} onClick={(e) => handleEditMatiere(node, e)} title="Modifier">
                <Edit2 size={14} />
              </button>
              <button className="flup-btn" style={{ padding: '4px', boxShadow: 'none', color: 'var(--flup-danger)' }} onClick={(e) => handleDeleteMatiere(node, e)} title="Supprimer">
                <Trash2 size={14} />
              </button>
            </div>
          )}

          {nextType && (
            <button 
              className="flup-btn" 
              style={{ padding: '4px 8px', marginLeft: 'auto', fontSize: '11px', boxShadow: 'none' }}
              onClick={(e) => { e.stopPropagation(); setIsOpen(true); handleOpenModal(nextType, node); }}
            >
              <PlusCircle size={14} /> Ajouter {nextType}
            </button>
          )}
        </div>
        {isOpen && hasChildren && (
          <div className="tree-children">
            {node.children.map(child => <TreeNode key={child.id} node={child} />)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="formations-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="flup-h1">Formations & Filières</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="flup-btn" onClick={fetchFormations} title="Actualiser l'arbre">
            <RefreshCw size={16} className={isLoading ? "rotating" : ""} /> Actualiser
          </button>
          <button className="flup-btn flup-btn--primary" onClick={() => handleOpenModal('filiere')}>
            <Plus size={16} /> Nouvelle Filière
          </button>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <div className="flup-card tree-view-card">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--flup-text-secondary)' }}>
            Chargement de l'arborescence des formations...
          </div>
        ) : data.length === 0 ? (
          <p className="flup-label" style={{ textAlign: 'center' }}>Aucune filière trouvée dans le backend.</p>
        ) : (
          data.map(node => <TreeNode key={node.id} node={node} />)
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Ajouter un(e) ${modalType}`}>
         <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
             <label className="flup-label">Nom ({modalType})</label>
             <input 
               type="text" 
               value={newItemName} 
               onChange={(e) => setNewItemName(e.target.value)} 
               style={{ padding: '10px 14px', border: '1px solid var(--flup-border)', borderRadius: '10px', outline: 'none', background: 'var(--flup-surface)' }}
               autoFocus
               required
               placeholder={`Nom du/de la ${modalType}...`}
             />
           </div>
           <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
             <button type="button" className="flup-btn" onClick={() => setIsModalOpen(false)}>Annuler</button>
             <button type="submit" className="flup-btn flup-btn--primary">Valider</button>
           </div>
         </form>
       </Modal>

      {/* Modale de gestion des matières */}
      <Modal isOpen={isMatiereModalOpen} onClose={() => setIsMatiereModalOpen(false)} title={isEditingMatiere ? "Modifier la matière" : "Ajouter une matière"}>
         <form onSubmit={submitMatiere} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
             <label className="flup-label">Nom de la matière</label>
             <input 
               type="text" 
               value={matiereFormData.nomMatiere} 
               onChange={(e) => setMatiereFormData({...matiereFormData, nomMatiere: e.target.value})} 
               style={{ padding: '10px 14px', border: '1px solid var(--flup-border)', borderRadius: '10px', outline: 'none', background: 'var(--flup-surface)' }}
               required 
               autoFocus
             />
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
             <label className="flup-label">Volume Horaire (heures)</label>
             <input 
               type="number" 
               value={matiereFormData.volumeHoraire} 
               onChange={(e) => setMatiereFormData({...matiereFormData, volumeHoraire: e.target.value})} 
               style={{ padding: '10px 14px', border: '1px solid var(--flup-border)', borderRadius: '10px', outline: 'none', background: 'var(--flup-surface)' }}
               required 
               min="1" 
             />
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
             <label className="flup-label">Coefficient</label>
             <input 
               type="number" 
               value={matiereFormData.coefficient} 
               onChange={(e) => setMatiereFormData({...matiereFormData, coefficient: e.target.value})} 
               style={{ padding: '10px 14px', border: '1px solid var(--flup-border)', borderRadius: '10px', outline: 'none', background: 'var(--flup-surface)' }}
               required 
               min="1" 
             />
           </div>
           <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
             <button type="button" className="flup-btn" onClick={() => setIsMatiereModalOpen(false)}>Annuler</button>
             <button type="submit" className="flup-btn flup-btn--primary">Valider</button>
           </div>
         </form>
       </Modal>
    </div>
  );
};

export default FormationsList;
