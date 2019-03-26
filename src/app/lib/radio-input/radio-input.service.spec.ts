import { IsRadioInputService } from './radio-input.service';

describe('IsRadioInputService', () => {
  let service: IsRadioInputService;

  beforeEach(() => {
    service = new IsRadioInputService();
  });

  describe('registerRadioInput', () => {
    it('should increments numberOfRadioInputs counter and returns incremented value', () => {
      expect(service.numberOfRadioInputs).toEqual(0);

      const result = service.registerRadioInput();

      expect(service.numberOfRadioInputs).toEqual(1);
      expect(result).toEqual(1);
    });
  });
});
