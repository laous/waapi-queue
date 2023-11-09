import { getAxios } from '..';
import { IAction } from '../../types';

const API_BASE_URL = '/action';

const axios = getAxios();

export const getActions = async (): Promise<IAction[]> => {
  const res = await axios.get(`${API_BASE_URL}`);
  return res.data;
};
