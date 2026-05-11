import React from 'react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';

const PaiementsList = () => {
  const data = [
    { id: 1, matricule: 'ETU-2026-001', nom: 'Alice Dupont', montant: '500 000', paye: '500 000', reste: '0', statut: 'À jour' },
    { id: 2, matricule: 'ETU-2026-002', nom: 'Lucas Martin', montant: '500 000', paye: '250 000', reste: '250 000', statut: 'En attente' },
    { id: 3, matricule: 'ETU-2026-003', nom: 'Sophie Bernard', montant: '500 000', paye: '0', reste: '500 000', statut: 'Retard' },
    { id: 4, matricule: 'ETU-2026-004', nom: 'Hugo Thomas', montant: '500 000', paye: '500 000', reste: '0', statut: 'À jour' },
    { id: 5, matricule: 'ETU-2026-005', nom: 'Emma Petit', montant: '500 000', paye: '100 000', reste: '400 000', statut: 'En attente' },
  ];

  const columns = [
    { key: 'matricule', label: 'Matricule' },
    { key: 'nom', label: 'Étudiant' },
    { 
      key: 'montant', 
      label: 'Montant Total', 
      render: (val) => <span className="flup-mono">{val} FCFA</span> 
    },
    { 
      key: 'paye', 
      label: 'Montant Payé', 
      render: (val) => <span className="flup-mono" style={{fontWeight: '700', color: 'var(--flup-success)'}}>{val} FCFA</span> 
    },
    { 
      key: 'reste', 
      label: 'Reste à payer', 
      render: (val) => <span className="flup-mono" style={{fontWeight: '700', color: val !== '0' ? 'var(--flup-danger)' : 'var(--flup-text-primary)'}}>{val} FCFA</span> 
    },
    { 
      key: 'statut', 
      label: 'Statut', 
      render: (val) => <StatusBadge status={val} /> 
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="flup-h1">État des Paiements</h1>
        <p className="flup-label" style={{ marginTop: '8px' }}>Suivi comptable des étudiants</p>
      </div>
      <DataTable columns={columns} data={data} searchable={true} exportable={true} />
    </div>
  );
};

export default PaiementsList;
