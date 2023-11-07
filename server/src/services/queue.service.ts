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
    console.log('Excuting the task for queue with id', queue.id);
    if (queue && queue.actions.length > 0) {
      await executeSingleQueueAction(queue as Queue);
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

  queue.actions.push(queueAction);
  queue.actions.sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime());

  await updateQueue(queue, queue.actions);
};

const getQueueActionToExecute = (queue: Queue) => {
  const actions = queue.actions.filter((action) => !action.executed);
  return actions.sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime())[0];
};

const updateQueue = async (queue: Queue, actions: QueueAction[]) => {
  await prisma.queue.update({
    where: {
      id: queue.id,
    },
    data: {
      actions: {
        set: actions,
      },
    },
  });
};

const checkIfQueueHasUnexecutedAction = (queue: Queue) => {
  return queue.actions.some((action) => !action.executed);
};
