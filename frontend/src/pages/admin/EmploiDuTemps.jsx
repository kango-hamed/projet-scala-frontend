import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import WeekCalendar from '../../components/common/WeekCalendar';
import Modal from '../../components/common/Modal';

const initialEvents = [
  { day: 0, start: 0, title: 'Algorithmique', room: 'Amphi A', prof: 'Prof. Martin', color: 'event-blue' },
  { day: 0, start: 2, title: 'Base de Données', room: 'Salle 102', prof: 'Prof. Dupont', color: 'event-green' },
  { day: 1, start: 1, title: 'Mathématiques Appliquées', room: 'Amphi B', prof: 'Prof. Bernard', color: 'event-orange' },
];

const EmploiDuTemps = () => {
  const [events, setEvents] = useState(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    day: '0',
    start: '0',
    title: '',
    room: '',
    prof: '',
    color: 'event-blue'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    const newEvent = {
      ...formData,
      day: parseInt(formData.day, 10),
      start: parseInt(formData.start, 10)
    };
    setEvents([...events, newEvent]);
    setIsModalOpen(false);
    // Reset form
    setFormData({ day: '0', start: '0', title: '', room: '', prof: '', color: 'event-blue' });
  };

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="flup-h1">Emploi du Temps</h1>
          <p className="flup-label" style={{ marginTop: '8px' }}>Gestion des créneaux et assignation des professeurs</p>
        </div>
        <button className="flup-btn flup-btn--primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Ajouter un Cours
        </button>
      </div>

      <WeekCalendar events={events} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assigner un cours">
        <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="flup-label">Jour</label>
              <select name="day" value={formData.day} onChange={handleChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--flup-border)', outline: 'none' }}>
                <option value="0">Lundi</option>
                <option value="1">Mardi</option>
                <option value="2">Mercredi</option>
                <option value="3">Jeudi</option>
                <option value="4">Vendredi</option>
                <option value="5">Samedi</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="flup-label">Heure de début</label>
              <select name="start" value={formData.start} onChange={handleChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--flup-border)', outline: 'none' }}>
                <option value="0">08:00</option>
                <option value="1">10:00</option>
                <option value="2">12:00</option>
                <option value="3">14:00</option>
                <option value="4">16:00</option>
                <option value="5">18:00</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="flup-label">Matière / Titre</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--flup-border)', outline: 'none' }} placeholder="Ex: Algorithmique Avancée" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="flup-label">Professeur assigné</label>
            <input type="text" name="prof" value={formData.prof} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--flup-border)', outline: 'none' }} placeholder="Ex: Dr. Martin" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="flup-label">Salle</label>
              <input type="text" name="room" value={formData.room} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--flup-border)', outline: 'none' }} placeholder="Ex: Amphi A" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="flup-label">Couleur</label>
              <select name="color" value={formData.color} onChange={handleChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--flup-border)', outline: 'none' }}>
                <option value="event-blue">Bleu</option>
                <option value="event-green">Vert</option>
                <option value="event-orange">Orange</option>
                <option value="event-purple">Violet</option>
                <option value="event-pink">Rose</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" className="flup-btn" onClick={() => setIsModalOpen(false)}>Annuler</button>
            <button type="submit" className="flup-btn flup-btn--primary">Créer le cours</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmploiDuTemps;
