import axiosClient from '../api/axiosClient';

const matiereService = {
  getAll: async () => {
    const response = await axiosClient.get('/matieres');
    return response.data;
  },
  
  getByEnseignant: async (id) => {
    const response = await axiosClient.get(`/matieres/enseignant/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosClient.post('/matieres', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await axiosClient.put(`/matieres/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await axiosClient.delete(`/matieres/${id}`);
    return response.data;
  }
};

export default matiereService;
