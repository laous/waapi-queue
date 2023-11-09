import * as queueService from '../../src/services/queue.service';
import * as userService from '../../src/services/user.service';
import prisma from '../../src/config/prisma';
import { Queue } from '@prisma/client';

jest.mock('../../src/config/prisma', () => ({
  queue: {
    findMany: jest.fn(),
    update: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
}));

jest.mock('../../src/services/user.service', () => ({
  executeUserAction: jest.fn(),
}));

describe('Testing queue.service', () => {
  beforeAll(() => {
    const mockedDate = new Date(2023, 11, 8);

    jest.useFakeTimers();
    jest.setSystemTime(mockedDate);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should execute queue actions', async () => {
    const mockQueue = {
      id: '1',
      userId: 'user1',
      actions: [
        {
          actionId: 'action1',
          addedAt: new Date(),
          executed: false,
        },
        {
          actionId: 'action2',
          addedAt: new Date(),
          executed: false,
        },
      ],
    } as Queue;

    const checkIfQueueHasUnexecutedActionSpy = jest
      .spyOn(queueService, 'checkIfQueueHasUnexecutedAction')
      .mockReturnValueOnce(true);
    const getQueueActionToExecuteSpy = jest
      .spyOn(queueService, 'getQueueActionToExecute')
      .mockResolvedValueOnce(mockQueue.actions[0]);
    const executeUserActionSpy = jest
      .spyOn(userService, 'executeUserAction')
      .mockResolvedValueOnce(true);
    const updateQueueSpy = jest
      .spyOn(queueService, 'updateQueue')
      .mockResolvedValueOnce(mockQueue);

    await queueService.executeSingleQueueAction(mockQueue);

    expect(checkIfQueueHasUnexecutedActionSpy).toHaveBeenCalledWith(mockQueue);
    expect(getQueueActionToExecuteSpy).toHaveBeenCalledWith(mockQueue);
    expect(executeUserActionSpy).toHaveBeenCalledWith(
      mockQueue.userId,
      mockQueue.actions[0].actionId
    );
    expect(updateQueueSpy).toHaveBeenCalledWith(mockQueue);

    checkIfQueueHasUnexecutedActionSpy.mockRestore();
    getQueueActionToExecuteSpy.mockRestore();
    executeUserActionSpy.mockRestore();
    updateQueueSpy.mockRestore();
  });

  it('should handle queues with no unexecuted actions', async () => {
    const mockQueue = {
      id: '1',
      userId: 'user1',
      actions: [
        {
          actionId: 'action1',
          addedAt: new Date(),
          executed: true,
        },
      ],
    } as Queue;

    (prisma.queue.findMany as jest.Mock).mockResolvedValueOnce([mockQueue]);

    const spy = jest.spyOn(console, 'log');
    await queueService.executeQueueActions();
    expect(spy).toHaveBeenCalledWith(
      'No unexecuted action found for queue with id',
      mockQueue.id
    );
    spy.mockRestore();
  });

  it('should handle an empty queue', async () => {
    const mockQueue: Queue = {
      id: '1',
      userId: 'user1',
      actions: [],
    };

    (prisma.queue.findMany as jest.Mock).mockResolvedValueOnce([mockQueue]);

    const spy = jest.spyOn(console, 'log');
    await queueService.executeQueueActions();
    expect(spy).toHaveBeenCalledWith(
      'No unexecuted action found for queue with id',
      mockQueue.id
    );
    spy.mockRestore();
  });

  it('should return null if all actions in the queue have been executed', async () => {
    const mockQueue = {
      id: '1',
      userId: 'user1',
      actions: [
        {
          actionId: 'action1',
          addedAt: new Date(),
          executed: true,
        },
      ],
    } as Queue;

    const result = await queueService.getQueueActionToExecute(mockQueue);

    expect(result).toBeNull();
  });

  it('should return false if the queue has no unexecuted actions', () => {
    const mockQueue = {
      id: '1',
      userId: 'user1',
      actions: [
        {
          actionId: 'action1',
          addedAt: new Date(),
          executed: true,
        },
      ],
    } as Queue;

    const result = queueService.checkIfQueueHasUnexecutedAction(mockQueue);

    expect(result).toBe(false);
  });
});
