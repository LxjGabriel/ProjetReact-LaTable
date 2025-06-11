import localStorageHelper from "./localStorageHelper";

export var axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token automatiquement
axiosInstance.interceptors.request.use((config) => {
  const token = localStorageHelper.getData("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // Vérifiez l'indicateur personnalisé
    if (error.config && error.config.handleErrorLocally) {
      // Ne pas traiter l'erreur dans l'intercepteur, la laisser être attrapée dans le `catch`
      return Promise.reject(error);
    }

    if (error.response) {
      if (error.response.status === 401) {
        // redirection vers logout
        
      }
    }
    return Promise.reject(error);
  }
);