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

  const canExecute = await checkIfUserHasCreditForAction(userId, actionId);

  if (!canExecute) return false;

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

  if (!user || !user.actions) {
    throw new Error('User or user actions not found');
  }

  const actions = user.actions;
  actions.forEach((action) => {
    if (action.actionId === actionId) {
      if (action.credit > 0) {
        action.credit = action.credit - 1;
      } else {
        return false;
      }
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

export const checkIfUserHasCreditForAction = async (
  userId: string,
  actionId: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      actions: true,
    },
  });
  const action = user.actions.find((action) => action.actionId === actionId);
  return action && action.credit > 0;
};
