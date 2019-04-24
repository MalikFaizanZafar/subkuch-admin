import { documentFactory } from './document-factory';

describe('documentFactory', () => {
  it('should return the document object', () => {
    expect(documentFactory()).toBe(document);
  });
});
