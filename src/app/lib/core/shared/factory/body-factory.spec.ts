import { bodyFactory } from './body-factory';

describe('bodyFactory', () => {
  it('should return the body object', () => {
    expect(bodyFactory()).toBe(document.body as any);
  });
});
