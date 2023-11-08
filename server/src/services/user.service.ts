import { Action, User, UserAction } from '@prisma/client';
import prisma from '../config/prisma';
import { getRandomNumber } from '../util';

export const calculateUserActionsCreditForAllUsers = async () => {
  const users = await prisma.user.findMany();
  const actions = await prisma.action.findMany();
  for (const user of users) {
    await calculateUserActionsCredit(user, actions);
  }
};

const calculateUserActionsCredit = async (user: User, actions: Action[]) => {
  if (!actions) return console.log('No actions found');
  const userActions: UserAction[] = actions.map((action) => {
    return {
      actionId: action.id,
      credit: action.maxCredits * getRandomNumber(0.8, 1.0),
      calculatedAt: new Date(),
    };
  });

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      actions: {
        set: userActions,
      },
    },
  });
};

export const executeUserAction = async (userId: string, actionId: string) => {
  if (!userId || !actionId) return;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      actions: {
        select: {
          actionId: true,
          credit: true,
        },
      },
    },
  });

  const canExecute = checkIfUserHasCreditForAction(
    user.actions as UserAction[],
    actionId
  );

  if (!canExecute) return false;

  const actions = user.actions;
  actions.forEach((action) => {
    if (action.actionId === actionId) {
      action.credit -= 1;
    }
  });
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      actions: {
        set: actions,
      },
    },
  });
  return true;
};

const checkIfUserHasCreditForAction = (
  actions: UserAction[],
  actionId: string
) => {
  const action = actions.find((action) => action.actionId === actionId);
  return action && action.credit > 0;
};
