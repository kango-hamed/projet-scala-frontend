import axiosClient from '../api/axiosClient';

const enseignantService = {
  /**
   * Récupérer la liste de tous les enseignants
   * @returns Promise
   */
  getAll: async () => {
    return await axiosClient.get('/enseignants');
  },

  /**
   * Créer un nouvel enseignant
   * @param {Object} data 
   * @returns Promise
   */
  create: async (data) => {
    return await axiosClient.post('/enseignants', data);
  },

  /**
   * Supprimer un enseignant
   * @param {string} id 
   * @returns Promise
   */
  delete: async (id) => {
    return await axiosClient.delete(`/enseignants/${id}`);
  },

  /**
   * Récupérer les cours assignés à un enseignant
   * @param {string} id 
   * @returns Promise
   */
  getCours: async (id) => {
    return await axiosClient.get(`/enseignants/${id}/cours`);
  }
};

export default enseignantService;
