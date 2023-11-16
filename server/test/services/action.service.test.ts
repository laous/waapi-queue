import { initializeActions } from '../../src/services/action.service';
import prisma from '../../src/config/prisma';

jest.mock('../../src/config/prisma', () => ({
  action: {
    createMany: jest.fn(),
    findMany: jest.fn(),
  },
}));

const DEFAULT_ACTIONS = [
  {
    name: 'Action 1',
    maxCredits: 26,
  },
  {
    name: 'Action 2',
    maxCredits: 32,
  },
];

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
      data: DEFAULT_ACTIONS,
    });
  });

  it('should not initialize actions', async () => {
    (prisma.action.findMany as jest.Mock).mockResolvedValueOnce(
      DEFAULT_ACTIONS
    );

    await initializeActions();

    expect(prisma.action.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.action.createMany).toHaveBeenCalledTimes(0);
  });
});
