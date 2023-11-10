import prisma from '../config/prisma';

const DEFAULT_ACTIONS = [
  {
    id: '1',
    name: 'Action 1',
    maxCredits: 26,
  },
  {
    id: '2',
    name: 'Action 2',
    maxCredits: 32,
  },
];

export const initializeActions = async () => {
  const actions = await prisma.action.findMany();
  if (!actions || actions.length === 0) {
    await prisma.action.createMany({
      data: DEFAULT_ACTIONS,
    });
  }
};
