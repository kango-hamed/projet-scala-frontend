import axiosClient from '../api/axiosClient';

const etudiantService = {
  /**
   * Récupérer la liste de tous les étudiants
   * @returns Promise
   */
  getAll: async () => {
    return await axiosClient.get('/etudiants');
  },

  /**
   * Créer un nouvel étudiant
   * @param {Object} data 
   * @returns Promise
   */
  create: async (data) => {
    return await axiosClient.post('/etudiants', data);
  },

  /**
   * Récupérer les infos d'un étudiant spécifique
   * @param {string} matricule 
   * @returns Promise
   */
  getByMatricule: async (matricule) => {
    return await axiosClient.get(`/etudiants/${matricule}`);
  },

  /**
   * Mettre à jour un étudiant
   * @param {string} matricule 
   * @param {Object} data 
   * @returns Promise
   */
  update: async (matricule, data) => {
    return await axiosClient.put(`/etudiants/${matricule}`, data);
  },

  /**
   * Obtenir les statistiques globales sur les étudiants
   * @returns Promise
   */
  getStats: async () => {
    return await axiosClient.get('/etudiants/stats');
  }
};

export default etudiantService;
