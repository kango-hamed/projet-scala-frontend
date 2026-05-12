import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Folder, FileText, Plus, PlusCircle, RefreshCw } from 'lucide-react';
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
      // Étape 1 : Récupérer la liste des filières
      const filieresRes = await formationService.getAll();
      if (filieresRes.success) {
        const filieres = filieresRes.data || [];
        
        // Étape 2 : Pour chaque filière, récupérer son arbre complet
        const fullTreePromises = filieres.map(async (filiere) => {
          const filiereId = filiere.code || filiere.nom || filiere;
          try {
            const arbreRes = await formationService.getArbre(filiereId);
            if (arbreRes.success) {
              return {
                id: filiereId,
                name: filiere.nom || filiere,
                type: 'filiere',
                children: formatTreeData(arbreRes.data, 'niveau')
              };
            }
          } catch (e) {
            console.warn(`Impossible de charger l'arbre pour la filière ${filiereId}`);
          }
          // Fallback en cas d'erreur de récupération de l'arbre
          return {
            id: filiereId,
            name: filiere.nom || filiere,
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
  const formatTreeData = (apiNodes, expectedType) => {
    if (!apiNodes || !Array.isArray(apiNodes)) return [];
    
    return apiNodes.map((node, index) => {
      const type = node.type || expectedType;
      const nextTypeMap = { niveau: 'semestre', semestre: 'ue', ue: 'matiere' };
      const nextType = nextTypeMap[type];

      return {
        id: node.id || node.code || `${type}-${index}-${Date.now()}`,
        name: node.nom || node.name || node.titre || node.libelle || node,
        type: type,
        children: node.children ? formatTreeData(node.children, nextType) : []
      };
    });
  };

  const handleOpenModal = (type, parentId = null) => {
    setModalType(type);
    setParentNodeId(parentId);
    setNewItemName('');
    setIsModalOpen(true);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    // Simulation d'ajout local puisque l'API ne liste pas encore de route POST pour les formations/UEs
    const newItem = { id: Date.now().toString(), name: newItemName, type: modalType, children: [] };
    
    if (modalType === 'filiere') {
      setData([...data, newItem]);
    } else {
      const addNode = (nodes) => {
        return nodes.map(node => {
          if (node.id === parentNodeId) {
            return { ...node, children: [...(node.children || []), newItem] };
          } else if (node.children) {
            return { ...node, children: addNode(node.children) };
          }
          return node;
        });
      };
      setData(addNode(data));
    }
    setIsModalOpen(false);
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
          
          {nextType && (
            <button 
              className="flup-btn" 
              style={{ padding: '4px 8px', marginLeft: 'auto', fontSize: '11px', boxShadow: 'none' }}
              onClick={(e) => { e.stopPropagation(); setIsOpen(true); handleOpenModal(nextType, node.id); }}
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
    </div>
  );
};

export default FormationsList;
