import { executeQueueActions } from '../../src/services/queue.service';
import prisma from '../../src/config/prisma';
import { Queue } from '@prisma/client';

jest.mock('../../src/config/prisma', () => ({
  queue: {
    findMany: jest.fn(),
    update: jest.fn(),
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
    const mockQueue1 = {
      id: '1',
      userId: 'user1',
      actions: [
        {
          actionId: 'action1',
          addedAt: new Date(),
          executed: false,
        },
      ],
    } as Queue;

    (prisma.queue.findMany as jest.Mock).mockResolvedValueOnce([mockQueue1]);

    const mockQueueAction1 = {
      ...mockQueue1.actions[0],
      executed: true,
      executedAt: new Date(),
    };

    (prisma.queue.update as jest.Mock).mockImplementation(async (data) => {
      const updatedQueue = { ...mockQueue1 };

      expect(data).toEqual({
        where: {
          id: mockQueue1.id,
        },
        data: {
          actions: {
            set: [updatedQueue.actions[0]],
          },
        },
      });
    });

    await executeQueueActions();

    expect(
      require('../../src/services/user.service').executeUserAction
    ).toHaveBeenCalledWith(mockQueue1.userId, mockQueueAction1.actionId);
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
    await executeQueueActions();
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
    await executeQueueActions();
    expect(spy).toHaveBeenCalledWith(
      'No unexecuted action found for queue with id',
      mockQueue.id
    );
    spy.mockRestore();
  });
});
