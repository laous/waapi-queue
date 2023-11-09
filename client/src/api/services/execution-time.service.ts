import { getAxios } from '..';
import { IExecutionTime } from '../../types';

const API_BASE_URL = '/execution-time';

const axios = getAxios();

export const getExecutionTime = async (): Promise<IExecutionTime> => {
  const res = await axios.get(`${API_BASE_URL}`);
  return res.data;
};
