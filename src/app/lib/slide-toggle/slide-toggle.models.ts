import { IsSlideToggle } from './slide-toggle';

/**
 * Represents a change in the slide toggle state
 */
export class IsSlideToggleChange {
  /**
   * The instance of the slide toggle where the
   * change was triggered
   */
  source: IsSlideToggle;

  /**
   * Whether or not the slide toggle is checked
   */
  checked: boolean;
}
