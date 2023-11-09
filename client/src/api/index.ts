import axios, { AxiosInstance } from 'axios';

let axiosInstance: AxiosInstance | null = null;

const createInstance = () => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL as string,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
      timeout: 1000,
    },
  });
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
