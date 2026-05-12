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

      // 401 = token absent ou expiré → déconnexion + redirection login
      if (status === 401) {
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      // 403 = authentifié mais accès refusé → on laisse la page gérer l'erreur
      // (ne pas supprimer le token ni rediriger)
    }

    // On propage l'erreur sous le format de l'API { success: false, erreur: "..." }
    return Promise.reject(error.response?.data || { success: false, erreur: "Erreur réseau ou serveur injoignable" });
  }
);

export default axiosClient;
