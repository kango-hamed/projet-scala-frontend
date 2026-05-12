import axiosClient from '../api/axiosClient';

const formationService = {
  /**
   * Récupère la liste de toutes les filières
   * @returns Promise
   */
  getAll: async () => {
    return await axiosClient.get('/formations');
  },

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
  }
};

export default formationService;
