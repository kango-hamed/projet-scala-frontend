import axiosClient from '../api/axiosClient';

const authService = {
  /**
   * Connecte un utilisateur
   * @param {string} email 
   * @param {string} password 
   * @returns Promise
   */
  login: async (email, password) => {
    return await axiosClient.post('/auth/login', { email, password });
  },

  /**
   * Récupère les informations de l'utilisateur connecté (via le token)
   * @returns Promise
   */
  getMe: async () => {
    return await axiosClient.get('/auth/me');
  },

  /**
   * Déconnecte l'utilisateur côté serveur
   * @returns Promise
   */
  logout: async () => {
    return await axiosClient.post('/auth/logout');
  }
};

export default authService;
