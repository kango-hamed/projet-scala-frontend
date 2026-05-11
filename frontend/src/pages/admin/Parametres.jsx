import React, { useState } from 'react';
import { Save, Building, Shield, Settings, Calendar } from 'lucide-react';

const Parametres = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputStyle = {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid var(--flup-border)',
    outline: 'none',
    backgroundColor: 'var(--flup-surface)',
    color: 'var(--flup-text-primary)',
    fontFamily: 'var(--flup-font-body)',
    fontSize: '13.5px',
    width: '100%',
    transition: 'border-color 0.2s'
  };

  const tabButtonStyle = (tabName) => ({
    justifyContent: 'flex-start',
    padding: '12px 16px',
    background: activeTab === tabName ? 'var(--flup-accent-light)' : 'transparent',
    color: activeTab === tabName ? 'var(--flup-accent)' : 'var(--flup-text-secondary)',
    boxShadow: 'none',
    border: 'none',
    fontWeight: activeTab === tabName ? 700 : 500
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="flup-h1">Paramètres</h1>
          <p className="flup-label" style={{ marginTop: '8px' }}>Configuration globale de la plateforme</p>
        </div>
        <button 
          className="flup-btn flup-btn--primary" 
          onClick={handleSave}
          style={saved ? { background: 'var(--flup-success)', border: 'none' } : {}}
        >
          <Save size={16} /> {saved ? 'Modifications enregistrées !' : 'Enregistrer les modifications'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        
        {/* SIDEBAR TABS */}
        <div style={{ width: '250px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button className="flup-btn" style={tabButtonStyle('general')} onClick={() => setActiveTab('general')}>
            <Building size={18} style={{ marginRight: '8px' }} /> Informations Générales
          </button>
          <button className="flup-btn" style={tabButtonStyle('annee')} onClick={() => setActiveTab('annee')}>
            <Calendar size={18} style={{ marginRight: '8px' }} /> Année Universitaire
          </button>
          <button className="flup-btn" style={tabButtonStyle('systeme')} onClick={() => setActiveTab('systeme')}>
            <Settings size={18} style={{ marginRight: '8px' }} /> Préférences Système
          </button>
          <button className="flup-btn" style={tabButtonStyle('securite')} onClick={() => setActiveTab('securite')}>
            <Shield size={18} style={{ marginRight: '8px' }} /> Sécurité & Accès
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="flup-card" style={{ flexGrow: 1, padding: '32px', minHeight: '400px' }}>
          
          {activeTab === 'general' && (
            <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 className="flup-h2" style={{ borderBottom: '1px solid var(--flup-border)', paddingBottom: '16px', marginBottom: '8px' }}>Profil de l'Établissement</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label className="flup-label" style={{ fontWeight: 600 }}>Nom de l'Université</label>
                  <input type="text" defaultValue="Université Tech d'Excellence" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label className="flup-label" style={{ fontWeight: 600 }}>Sigle / Acronyme</label>
                  <input type="text" defaultValue="UTE" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="flup-label" style={{ fontWeight: 600 }}>Adresse Principale</label>
                <input type="text" defaultValue="123 Avenue du Savoir, Campus Central" style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label className="flup-label" style={{ fontWeight: 600 }}>Email de Contact</label>
                  <input type="email" defaultValue="contact@ute.edu" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label className="flup-label" style={{ fontWeight: 600 }}>Téléphone Administratif</label>
                  <input type="tel" defaultValue="+221 33 000 00 00" style={inputStyle} />
                </div>
              </div>
            </form>
          )}

          {activeTab === 'annee' && (
            <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 className="flup-h2" style={{ borderBottom: '1px solid var(--flup-border)', paddingBottom: '16px', marginBottom: '8px' }}>Année Universitaire Active</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="flup-label" style={{ fontWeight: 600 }}>Année en cours</label>
                <select style={inputStyle}>
                  <option>2025 - 2026</option>
                  <option>2026 - 2027</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label className="flup-label" style={{ fontWeight: 600 }}>Date de rentrée (Semestre 1)</label>
                  <input type="date" defaultValue="2025-10-01" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label className="flup-label" style={{ fontWeight: 600 }}>Fin des cours (Semestre 2)</label>
                  <input type="date" defaultValue="2026-06-30" style={inputStyle} />
                </div>
              </div>
            </form>
          )}

          {activeTab === 'systeme' && (
            <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 className="flup-h2" style={{ borderBottom: '1px solid var(--flup-border)', paddingBottom: '16px', marginBottom: '8px' }}>Préférences Système</h2>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', border: '1px solid var(--flup-border)', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--flup-text-primary)', marginBottom: '4px' }}>Notifications Email</div>
                  <div className="flup-label">Envoyer un mail automatique aux étudiants lors de l'ajout d'une note.</div>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--flup-accent)' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', border: '1px solid var(--flup-border)', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--flup-text-primary)', marginBottom: '4px' }}>Mode Maintenance</div>
                  <div className="flup-label">Bloquer temporairement l'accès aux étudiants et enseignants.</div>
                </div>
                <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: 'var(--flup-accent)' }} />
              </div>
            </form>
          )}

          {activeTab === 'securite' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 className="flup-h2" style={{ borderBottom: '1px solid var(--flup-border)', paddingBottom: '16px', marginBottom: '8px' }}>Sécurité & Données</h2>
              
              <div style={{ padding: '24px', background: 'var(--flup-danger-bg)', borderRadius: '10px', border: '1px solid var(--flup-danger)' }}>
                <h3 className="flup-h2" style={{ color: 'var(--flup-danger)', marginBottom: '12px' }}>Zone de Danger</h3>
                <p className="flup-label" style={{ marginBottom: '20px', color: 'var(--flup-danger)' }}>
                  La réinitialisation de l'année scolaire effacera les emplois du temps actuels et archivera toutes les notes. Cette action est <b>irréversible</b>.
                </p>
                <button className="flup-btn" style={{ background: 'var(--flup-danger)', color: 'white', border: 'none' }}>Clôturer l'année académique</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Parametres;
