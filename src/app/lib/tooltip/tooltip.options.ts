import { IsTooltipTriggerType } from './tooltip-trigger.types';
import { IsTooltipPosition } from './tooltip.models';

/**
 * Model class to be used to set the Global options.
 */
export class IsTooltipOptions {

  /**
   * Tooltip position - topleft, top, topright, bottomleft, bottom, bottomright, left, right.
   * Default is top.
   */
  placement?: IsTooltipPosition;

  /**
   * To be used to set the event type for showing the tooltip.
   */
  trigger?: IsTooltipTriggerType;

  /**
   * To be used to hide the tooltip with some delay.
   */
  hideDelay?: number;

  /**
   * To be used to show the tooltip with some delay.
   */
  showDelay?: number;

  constructor() {
    this.placement = IsTooltipPosition.Top;
    this.trigger = IsTooltipTriggerType.Hover;
    this.hideDelay = 0;
    this.showDelay = 0;
  }
}
