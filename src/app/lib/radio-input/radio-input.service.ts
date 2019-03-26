import { Injectable } from '@angular/core';

/**
 * Service to register radio inputs
 */
@Injectable()
export class IsRadioInputService {
  /**
   * Number of radio inputs
   */
  numberOfRadioInputs = 0;

  /**
   * Registers radio input by increasing
   * number of radio input counter
   */
  registerRadioInput(): number {
    this.numberOfRadioInputs++;
    return this.numberOfRadioInputs;
  }
}
