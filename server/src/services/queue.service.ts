import { Queue, QueueAction } from '@prisma/client';
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

const executeSingleQueueAction = async (queue: Queue) => {
  if (!checkIfQueueHasUnexecutedAction(queue)) {
    console.log('No unexecuted action found for queue with id', queue.id);
    return;
  }
  const queueAction = getQueueActionToExecute(queue);
  console.log(
    'Executing action with id',
    queueAction.actionId,
    'for queue with id',
    queue.id
  );

  queueAction.executed = true;
  queueAction.executedAt = new Date();
  await executeUserAction(queue.userId, queueAction.actionId);

  const index = queue.actions.findIndex(
    (action) => action.actionId === queueAction.actionId
  );
  queue.actions[index] = queueAction;
  queue.actions.sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime());

  return await updateQueue(queue);
};

const getQueueActionToExecute = (queue: Queue) => {
  const actions = queue.actions.filter((action) => !action.executed);
  return actions.sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime())[0];
};

const updateQueue = async (queue: Queue) => {
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

const checkIfQueueHasUnexecutedAction = (queue: Queue) => {
  if (!queue.actions) return false;
  if (queue.actions.length === 0) return false;
  return queue.actions.some((action) => !action.executed);
};
