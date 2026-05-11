import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FileText, Plus, PlusCircle } from 'lucide-react';
import Modal from '../../components/common/Modal';
import './FormationsList.css';

const initialTree = [
  {
    id: 'f1', name: 'Informatique', type: 'filiere',
    children: [
      {
        id: 'n1', name: 'Licence 1', type: 'niveau',
        children: [
          {
            id: 's1', name: 'Semestre 1', type: 'semestre',
            children: [
              { id: 'ue1', name: 'UE1: Fondamentaux', type: 'ue', children: [{ id: 'm1', name: 'Algorithmique (Coef 4)', type: 'matiere' }, { id: 'm2', name: 'Architecture (Coef 3)', type: 'matiere' }] },
            ]
          }
        ]
      }
    ]
  }
];

const FormationsList = () => {
  const [data, setData] = useState(initialTree);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('filiere'); 
  const [parentNodeId, setParentNodeId] = useState(null);
  const [newItemName, setNewItemName] = useState('');

  const handleOpenModal = (type, parentId = null) => {
    setModalType(type);
    setParentNodeId(parentId);
    setNewItemName('');
    setIsModalOpen(true);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const newItem = { id: Date.now().toString(), name: newItemName, type: modalType, children: [] };
    
    if (modalType === 'filiere') {
      setData([...data, newItem]);
    } else {
      // Fonction récursive pour insérer au bon endroit
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
        <button className="flup-btn flup-btn--primary" onClick={() => handleOpenModal('filiere')}>
          <Plus size={16} /> Nouvelle Filière
        </button>
      </div>
      <div className="flup-card tree-view-card">
        {data.length === 0 ? (
          <p className="flup-label" style={{ textAlign: 'center' }}>Aucune filière configurée.</p>
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
