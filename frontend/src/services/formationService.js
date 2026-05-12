import axiosClient from '../api/axiosClient';

const formationService = {
  /**
   * Récupère la liste de toutes les filières
   * @returns Promise
   */
  getAll: async () => {
    return await axiosClient.get('/formations');
  },

  // ─── CRUD Formations & Structure ───────────

  createFormation: async (data) => axiosClient.post('/formations', data),
  createNiveau: async (data) => axiosClient.post('/niveaux', data),
  createSemestre: async (data) => axiosClient.post('/semestres', data),
  createUE: async (data) => axiosClient.post('/ues', data),

  /**
   * Récupère l'arbre complet d'une filière (Filière -> Niveaux -> UEs)
   * @param {string} filiere 
   * @returns Promise
   */
  getArbre: async (filiere) => {
    return await axiosClient.get(`/formations/${filiere}/arbre`);
  },

  /**
   * Récupère les volumes horaires par semestre pour une filière
   * @param {string} filiere 
   * @returns Promise
   */
  getVolumes: async (filiere) => {
    return await axiosClient.get(`/formations/${filiere}/volumes`);
  },

  // ─── CRUD Matières ────────────────────────
  
  createMatiere: async (data) => {
    return await axiosClient.post('/matieres', data);
  },
  
  updateMatiere: async (id, data) => {
    return await axiosClient.put(`/matieres/${id}`, data);
  },
  
  deleteMatiere: async (id) => {
    return await axiosClient.delete(`/matieres/${id}`);
  }
};

export default formationService;
