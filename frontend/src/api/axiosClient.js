import axios from 'axios';

// Création de l'instance Axios avec la configuration de base
const axiosClient = axios.create({
  baseURL: 'http://localhost:9000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requêtes pour injecter le token JWT
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponses pour gérer les erreurs globales (ex: 401, 403)
axiosClient.interceptors.response.use(
  (response) => {
    // Si la requête est un succès, on renvoie directement les données (qui contiennent { success, data })
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      // Déconnexion automatique si token invalide, expiré ou accès interdit
      if (status === 401 || status === 403) {
        localStorage.removeItem('token');
        
        // Redirection brutale vers /login s'il n'y est pas déjà
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    
    // On propage l'erreur sous le format de l'API { success: false, erreur: "..." }
    return Promise.reject(error.response?.data || { success: false, erreur: "Erreur réseau ou serveur injoignable" });
  }
);

export default axiosClient;
