import { initializeActions } from '../../src/services/action.service';
import prisma from '../../src/config/prisma';

jest.mock('../../src/config/prisma', () => ({
  action: {
    createMany: jest.fn(),
    findMany: jest.fn(),
  },
}));

describe('Testing action.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize actions', async () => {
    (prisma.action.findMany as jest.Mock).mockResolvedValueOnce([]);

    await initializeActions();

    expect(prisma.action.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.action.createMany).toHaveBeenCalledTimes(1);
    expect(prisma.action.createMany).toHaveBeenCalledWith({
      data: [
        {
          id: '1',
          name: 'Action 1',
          maxCredits: 20,
        },
        {
          id: '2',
          name: 'Action 2',
          maxCredits: 20,
        },
      ],
    });
  });

  it('should not initialize actions', async () => {
    (prisma.action.findMany as jest.Mock).mockResolvedValueOnce([
      {
        id: '1',
        name: 'Action 1',
        maxCredits: 20,
      },
      {
        id: '2',
        name: 'Action 2',
        maxCredits: 20,
      },
    ]);

    await initializeActions();

    expect(prisma.action.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.action.createMany).toHaveBeenCalledTimes(0);
  });
});
