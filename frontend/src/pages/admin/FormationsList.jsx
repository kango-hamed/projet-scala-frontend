import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FileText, Plus } from 'lucide-react';
import './FormationsList.css';

const treeData = [
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
              { id: 'ue2', name: 'UE2: Mathématiques', type: 'ue', children: [{ id: 'm3', name: 'Analyse 1 (Coef 3)', type: 'matiere' }] }
            ]
          },
          {
            id: 's2', name: 'Semestre 2', type: 'semestre',
            children: []
          }
        ]
      },
      {
        id: 'n2', name: 'Licence 2', type: 'niveau', children: []
      }
    ]
  },
  {
    id: 'f2', name: 'Mathématiques Appliquées', type: 'filiere', children: []
  }
];

const TreeNode = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="tree-node">
      <div className={`tree-node-content ${node.type}`} onClick={() => setIsOpen(!isOpen)}>
        <span className="tree-toggle">
          {hasChildren ? (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />) : <span style={{width: 16, display: 'inline-block'}}></span>}
        </span>
        <span className="tree-icon">
          {node.type === 'matiere' ? <FileText size={16} /> : <Folder size={16} />}
        </span>
        <span className="tree-label">{node.name}</span>
        <span className="tree-badge">{node.type}</span>
      </div>
      {isOpen && hasChildren && (
        <div className="tree-children">
          {node.children.map(child => <TreeNode key={child.id} node={child} />)}
        </div>
      )}
    </div>
  );
};

const FormationsList = () => {
  return (
    <div className="formations-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Formations & Filières</h2>
        <button className="btn-primary">
          <Plus size={20} /> Nouvelle Filière
        </button>
      </div>
      <div className="tree-view-card glass-effect">
        {treeData.map(node => <TreeNode key={node.id} node={node} />)}
      </div>
    </div>
  );
};

export default FormationsList;
