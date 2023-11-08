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
};
