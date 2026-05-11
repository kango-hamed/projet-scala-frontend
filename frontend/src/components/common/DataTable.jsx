import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Download } from 'lucide-react';
import './DataTable.css';

const DataTable = ({ columns, data, searchable = true, exportable = true, itemsPerPage = 10 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowercasedSearch = searchTerm.toLowerCase();
    return data.filter(item => {
      return Object.values(item).some(
        val => String(val).toLowerCase().includes(lowercasedSearch)
      );
    });
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const exportCSV = () => {
    const headers = columns.map(col => col.label).join(',');
    const rows = sortedData.map(row => 
      columns.map(col => `"${row[col.key] || ''}"`).join(',')
    ).join('\n');
    
    const csvContent = `data:text/csv;charset=utf-8,\n${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'export_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flup-card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Table Toolbar */}
      {(searchable || exportable) && (
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--flup-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {searchable ? (
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--flup-text-muted)' }} />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="flup-input-search"
                style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '10px', border: '1px solid var(--flup-border)', outline: 'none', fontFamily: 'var(--flup-font-body)', fontSize: '13px', color: 'var(--flup-text-primary)' }}
              />
            </div>
          ) : <div></div>}
          
          {exportable && (
            <button className="flup-btn" onClick={exportCSV}>
              <Download size={16} /> Exporter CSV
            </button>
          )}
        </div>
      )}

      {/* Table Content */}
      <div style={{ overflowX: 'auto' }}>
        <table className="flup-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={col.sortable !== false ? 'sortable' : ''}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {col.label}
                    {sortConfig.key === col.key && (
                      <span style={{ color: 'var(--flup-accent)' }}>
                        {sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, rowIndex) => (
                <tr key={row.id || rowIndex}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '32px', color: 'var(--flup-text-muted)' }}>
                  Aucune donnée trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--flup-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="flup-label">
          Affichage de {sortedData.length > 0 ? startIndex + 1 : 0} à {Math.min(endIndex, sortedData.length)} sur {sortedData.length}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="flup-btn" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
            style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            Précédent
          </button>
          <button 
            className="flup-btn" 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages || totalPages === 0}
            style={{ opacity: currentPage === totalPages || totalPages === 0 ? 0.5 : 1, cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer' }}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
