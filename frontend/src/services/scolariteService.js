import axiosClient from '../api/axiosClient';

const scolariteService = {
  /**
   * Récupérer le relevé de notes d'un étudiant
   * @param {string} matricule 
   * @returns Promise
   */
  getNotes: async (matricule) => {
    return await axiosClient.get(`/notes/${matricule}`);
  },

  /**
   * Saisir une nouvelle note pour un étudiant
   * @param {Object} data 
   * @returns Promise
   */
  saisirNote: async (data) => {
    return await axiosClient.post('/notes', data);
  },

  /**
   * Récupérer les absences d'un étudiant
   * @param {string} matricule 
   * @returns Promise
   */
  getAbsences: async (matricule) => {
    return await axiosClient.get(`/absences/${matricule}`);
  },

  /**
   * Obtenir la liste des étudiants dépassant 10h d'absence
   * @returns Promise
   */
  getAbsencesARisque: async () => {
    return await axiosClient.get('/absences/a-risque');
  }
};

export default scolariteService;
