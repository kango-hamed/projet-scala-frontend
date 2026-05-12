import axiosClient from '../api/axiosClient';

const financeService = {
  /**
   * Récupérer la synthèse financière globale (Admin)
   * @returns Promise
   */
  getSynthese: async () => {
    return await axiosClient.get('/paiements/synthese');
  },

  /**
   * Obtenir la liste des étudiants avec des paiements en retard (Admin)
   * @returns Promise
   */
  getEnDette: async () => {
    return await axiosClient.get('/paiements/en-dette');
  },

  /**
   * Obtenir la situation financière d'un étudiant spécifique
   * @param {string} matricule 
   * @returns Promise
   */
  getSituation: async (matricule) => {
    return await axiosClient.get(`/paiements/${matricule}`);
  }
};

export default financeService;
