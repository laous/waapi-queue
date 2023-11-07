import prisma from '../config/prisma';

export const add2MinExecutionTime = async () => {
  const now = new Date();
  return await prisma.executionTime.update({
    where: {
      id: 1,
    },
    data: {
      lastExecutionTime2Minutes: now,
    },
  });
};

export const add24HoursExecutionTime = async () => {
  const now = new Date();
  return await prisma.executionTime.update({
    where: {
      id: 1,
    },
    data: {
      lastExecutionTime24Hours: now,
    },
  });
};

export const initializeExecutionTime = async () => {
  const executionTime = await prisma.executionTime.findUnique({
    where: {
      id: 1,
    },
  });

  if (!executionTime) {
    await prisma.executionTime.create({
      data: {
        id: 1,
      },
    });
  }
};
