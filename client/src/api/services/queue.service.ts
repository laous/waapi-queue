import { getAxios } from '..';
import { IAction, IQueue } from '../../types';
import { getActions } from './action.service';

const API_BASE_URL = '/queue';

const axios = getAxios();

export const getQueue = async (): Promise<IQueue> => {
  const res = await axios.get(`${API_BASE_URL}`);
  const queue: IQueue = res.data;
  const actions = await getActions();
  const queueWithActionNames = addNamesToActions(queue, actions);
  console.log(queueWithActionNames);
  return queueWithActionNames;
};

const addNamesToActions = (queue: IQueue, actions: IAction[]) => {
  const queueActions = queue.actions;
  if (!queueActions || queueActions.length == 0) return queue;
  const updatedQueueActions = queueActions.map((queueAction) => {
    const action = actions.find((action) => action.id === queueAction.actionId);
    return {
      ...queueAction,
      name: action?.name,
    };
  });
  return {
    ...queue,
    actions: updatedQueueActions,
  };
};

export const addActionToQueue = async (actionId: string): Promise<IQueue> => {
  const res = await axios.post(`${API_BASE_URL}/action/${actionId}`);
  return res.data;
};
