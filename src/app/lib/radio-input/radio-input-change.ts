import { IsRadioInput } from './radio-input';

/**
 * Change event for radio inputs
 */
export class IsRadioInputChange {
  /**
   * The emitting radio input
   */
  source: IsRadioInput;

  /**
   * The selected value
   */
  value: string;
}
