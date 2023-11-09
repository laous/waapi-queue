import { getAxios } from '..';
import { IAction, IUser, IUserAction } from '../../types';
import { getActions } from './action.service';

const API_BASE_URL = '/user';

const axios = getAxios();

export const getUserActions = async (): Promise<IUserAction[]> => {
  const user = await getUser();
  if (!user) return [];

  const actions: IAction[] = await getActions();
  const userActions = user.actions;
  if (!userActions || userActions.length == 0) return [];
  const updatedUserActions = userActions.map((userAction) => {
    const action = actions.find((action) => action.id === userAction.actionId);
    return {
      ...userAction,
      name: action?.name,
    };
  });
  return updatedUserActions;
};

const getUser = async (): Promise<IUser> => {
  const res = await axios.get(`${API_BASE_URL}`);
  const user: IUser = res.data;
  if (!user) {
    return localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!)
      : null;
  }
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};
