import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Book, MapPin, Phone } from 'lucide-react';

const Profil = () => {
  const { user } = useAuth();
  
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 className="flup-h1" style={{ marginBottom: '32px' }}>Mon Profil</h1>
      
      <div className="flup-card" style={{ display: 'flex', gap: '48px', alignItems: 'flex-start', padding: '40px' }}>
        
        {/* Colonne Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', minWidth: '200px' }}>
          <div className="flup-avatar" style={{ width: '120px', height: '120px', fontSize: '36px', background: 'linear-gradient(135deg, var(--flup-accent), #0f766e)' }}>
            {user?.name?.substring(0,2).toUpperCase() || 'US'}
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 className="flup-h2" style={{ fontSize: '20px' }}>{user?.name || 'Utilisateur'}</h2>
            <span className="flup-badge flup-badge--up" style={{ marginTop: '12px', display: 'inline-block', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {user?.role || 'Rôle inconnu'}
            </span>
          </div>
          <button className="flup-btn" style={{ marginTop: '8px', width: '100%', justifyContent: 'center' }}>
            Modifier l'avatar
          </button>
        </div>

        {/* Colonne Infos */}
        <div style={{ flexGrow: 1, paddingLeft: '48px', borderLeft: '1px solid var(--flup-border)' }}>
          <h3 className="flup-h2" style={{ marginBottom: '32px', color: 'var(--flup-text-secondary)', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Informations Personnelles
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <User size={20} color="var(--flup-text-muted)" style={{ marginTop: '2px' }} />
                <div>
                  <p className="flup-label" style={{ marginBottom: '4px' }}>Nom Complet</p>
                  <p style={{ fontWeight: 600, color: 'var(--flup-text-primary)' }}>{user?.name || 'Non défini'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <Mail size={20} color="var(--flup-text-muted)" style={{ marginTop: '2px' }} />
                <div>
                  <p className="flup-label" style={{ marginBottom: '4px' }}>Email Institutionnel</p>
                  <p style={{ fontWeight: 600, color: 'var(--flup-text-primary)' }}>{user?.email || 'email@univ.edu'}</p>
                </div>
              </div>
            </div>

            {user?.role === 'enseignant' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', paddingTop: '24px', borderTop: '1px dashed var(--flup-border)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <Book size={20} color="var(--flup-text-muted)" style={{ marginTop: '2px' }} />
                  <div>
                    <p className="flup-label" style={{ marginBottom: '4px' }}>Spécialité Principale</p>
                    <p style={{ fontWeight: 600, color: 'var(--flup-text-primary)' }}>Informatique & Math. Appliquées</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <MapPin size={20} color="var(--flup-text-muted)" style={{ marginTop: '2px' }} />
                  <div>
                    <p className="flup-label" style={{ marginBottom: '4px' }}>Bureau Assigné</p>
                    <p style={{ fontWeight: 600, color: 'var(--flup-text-primary)' }}>Bâtiment C - Salle 302</p>
                  </div>
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '24px', borderTop: '1px solid var(--flup-border)' }}>
              <Shield size={20} color="var(--flup-text-muted)" />
              <div>
                <p className="flup-label" style={{ marginBottom: '4px' }}>Mot de passe</p>
                <p style={{ fontWeight: 600, color: 'var(--flup-text-primary)', letterSpacing: '2px' }}>••••••••</p>
              </div>
              <button className="flup-btn" style={{ marginLeft: 'auto' }}>Changer le mot de passe</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
