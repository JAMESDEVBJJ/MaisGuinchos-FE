import axios from "axios";
import { toast } from "react-hot-toast";

export const api = axios.create(
    {baseURL: "https://localhost:7120/api"}
);

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
  
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  
    return config;
  });
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        if (error.response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }

        const message =
          error.response.data?.message ||
          error.response.data?.error || error.response.data ||
          "Erro inesperado";
  
        toast.error(message);
      } else {
        toast.error("Erro de conexão com o servidor.");
      }
  
      return Promise.reject(error);
    }
  );
  api.interceptors.response.use(
    response => response,
    error => {

      if (error.response) {
        const message = error.response.data?.message || "Erro inesperado";
      }

      return Promise.reject(error);
    }
  );