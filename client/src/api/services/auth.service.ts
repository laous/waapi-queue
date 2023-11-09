import { getAxios, resetAxios } from '..';

const API_BASE_URL = '/auth';

const axios = getAxios();

export const createNewAccount = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await axios.post(`${API_BASE_URL}/register`, {
    email,
    name,
    password,
  });
  const token = res.data.token;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(res.data.user));
  resetAxios();
};

export const login = async (email: string, password: string) => {
  const res = await axios.post(`${API_BASE_URL}/login`, {
    email,
    password,
  });
  const token = res.data.token;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(res.data.user));
  resetAxios();
  return res;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  resetAxios();
};
