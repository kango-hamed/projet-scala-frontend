import axiosClient from '../api/axiosClient';

const emploiDuTempsService = {
  getAll: async () => {
    try {
      const response = await axiosClient.get('/emploi-du-temps');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getByFiliere: async (filiere) => {
    try {
      const response = await axiosClient.get(`/emploi-du-temps/filiere/${filiere}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getByEnseignant: async (id) => {
    try {
      const response = await axiosClient.get(`/emploi-du-temps/enseignant/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getConflits: async () => {
    try {
      const response = await axiosClient.get('/emploi-du-temps/conflits');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  create: async (seanceData) => {
    try {
      const response = await axiosClient.post('/emploi-du-temps', seanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axiosClient.delete(`/emploi-du-temps/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default emploiDuTempsService;
