import { IsDropdownPlacement } from './dropdown-placement';

export class IsDropdownOptions {
  /**
   * Whether or not reverse inversed theme should be used.
   */
  inverse?: boolean;

  /**
   * Placement choices for dropdown
   */
  placement?: IsDropdownPlacement;

  /**
   * Whether or not to use the basic button theme.
   */
  basicButton?: boolean;

  constructor() {
    this.inverse = false;
    this.placement = IsDropdownPlacement.Bottom;
    this.basicButton = true;
  }
}
