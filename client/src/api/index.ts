import axios, { AxiosInstance } from 'axios';

let axiosInstance: AxiosInstance | null = null;

const createInstance = () => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL as string,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 1000,
  });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

export const getAxios = (): AxiosInstance => {
  if (!axiosInstance) {
    axiosInstance = createInstance();
  }
  return axiosInstance;
};

export const resetAxios = (): void => {
  axiosInstance = createInstance();
};
