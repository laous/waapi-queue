import { Queue } from '@prisma/client';
import prisma from '../config/prisma';
import { executeUserAction } from './user.service';

export const executeQueueActions = async () => {
  const queues = await prisma.queue.findMany({
    select: {
      id: true,
      userId: true,
      actions: {
        select: {
          actionId: true,
          addedAt: true,
          executed: true,
        },
      },
    },
  });
  for (const queue of queues) {
    if (queue && queue.actions.length > 0) {
      console.log('Excuting the actions of queue with id', queue.id);
      await executeSingleQueueAction(queue as Queue);
    } else {
      console.log('No unexecuted action found for queue with id', queue.id);
    }
  }
};

export const executeSingleQueueAction = async (queue: Queue) => {
  if (!checkIfQueueHasUnexecutedAction(queue)) {
    console.log('No unexecuted action found for queue with id', queue.id);
    return;
  }
  const queueAction = getQueueActionToExecute(queue);

  queueAction.executed = await executeUserAction(
    queue.userId,
    queueAction.actionId
  );

  if (queueAction.executed) {
    queueAction.executedAt = new Date();
    const index = queue.actions.findIndex(
      (action) => action.actionId === queueAction.actionId
    );
    queue.actions[index] = queueAction;
    queue.actions.sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime());
    return await updateQueue(queue);
  } else {
    console.log(
      'Action with id',
      queueAction.actionId,
      'for queue with id',
      queue.id,
      'could not be executed'
    );
    return;
  }
};

export const getQueueActionToExecute = (queue: Queue) => {
  const actions = queue.actions.filter((action) => !action.executed);
  if (actions.length === 0) return null;
  return actions.sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime())[0];
};

export const updateQueue = async (queue: Queue) => {
  return await prisma.queue.update({
    where: {
      id: queue.id,
    },
    data: {
      actions: {
        set: queue.actions,
      },
    },
  });
};

export const checkIfQueueHasUnexecutedAction = (queue: Queue) => {
  if (!queue.actions) return false;
  if (queue.actions.length === 0) return false;
  return queue.actions.some((action) => !action.executed);
};
