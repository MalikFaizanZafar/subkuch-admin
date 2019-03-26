import { DF_COLORS } from '../core/constants';
import { IsRadioInputLabelPosition } from './radio-input-label-position';

/**
 * IsRadioInputConfig holds global configuration for Radio Input
 */
export class IsRadioInputConfig {
  /**
   * Radio's default checked color
   */
  checkedColor = DF_COLORS.BLACK;

  /**
   * Radio's default unchecked color
   */
  uncheckedColor = DF_COLORS.BLACK;

  /**
   * Radio's default label color
   */
  labelColor = DF_COLORS.BLACK;

  /**
   * Radio's default label position
   */
  labelPosition = IsRadioInputLabelPosition.After;
}
