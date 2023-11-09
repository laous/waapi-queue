import { IAction, IUser, IUserAction } from '../../types';
import { getActions } from './action.service';

export const getUserActions = async (): Promise<IUserAction[]> => {
  const localStorageUser = localStorage.getItem('user');
  if (!localStorageUser) return [];

  const user = JSON.parse(localStorageUser) as IUser;

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
