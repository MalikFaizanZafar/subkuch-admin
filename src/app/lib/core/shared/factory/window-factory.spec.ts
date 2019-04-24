import { windowFactory } from './window-factory';

describe('windowFactory', () => {
  it('should return the window object', () => {
    expect(windowFactory()).toBe(window);
  });
});
