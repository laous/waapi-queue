import { getRandomNumber } from '../../src/util';

describe('Testing getRandomNumber function', () => {
  it('should return a random number between 0.8 and 1.0', () => {
    const result = getRandomNumber(0.8, 1.0);
    expect(result).toBeGreaterThanOrEqual(0.8);
    expect(result).toBeLessThanOrEqual(1.0);
  });
});
