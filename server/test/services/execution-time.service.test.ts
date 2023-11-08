import { initializeExecutionTime } from '../../src/services/execution-time.service';
import prisma from '../../src/config/prisma';

jest.mock('../../src/config/prisma', () => ({
  executionTime: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
  },
}));

describe('Testing execution-time.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize execution time', async () => {
    (prisma.executionTime.findUnique as jest.Mock).mockResolvedValueOnce(null);

    await initializeExecutionTime();

    expect(prisma.executionTime.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.executionTime.create).toHaveBeenCalledTimes(1);
    expect(prisma.executionTime.create).toHaveBeenCalledWith({
      data: {
        id: 1,
      },
    });
  });

  it('should not initialize execution time', async () => {
    (prisma.executionTime.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 1,
    });

    await initializeExecutionTime();

    expect(prisma.executionTime.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.executionTime.create).toHaveBeenCalledTimes(0);
  });

  it('should add 2 minutes execution time', async () => {
    const mockedDate = new Date(2023, 11, 8);

    jest.useFakeTimers();
    jest.setSystemTime(mockedDate);

    (prisma.executionTime.update as jest.Mock).mockImplementation(
      async (data) => {
        expect(data).toEqual({
          where: {
            id: 1,
          },
          data: {
            lastExecutionTime2Minutes: mockedDate,
          },
        });
      }
    );
  });

  it('should add 24 hours execution time', async () => {
    const mockedDate = new Date(2023, 11, 8);

    jest.useFakeTimers();
    jest.setSystemTime(mockedDate);

    (prisma.executionTime.update as jest.Mock).mockImplementation(
      async (data) => {
        expect(data).toEqual({
          where: {
            id: 1,
          },
          data: {
            lastExecutionTime24Hours: mockedDate,
          },
        });
      }
    );
  });
});
