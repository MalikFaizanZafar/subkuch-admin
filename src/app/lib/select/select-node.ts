/**
 * Interface to assign select data in case of nested select
 */
export interface IsSelectNode {
  /**
   * Value of the option
   */
  value: any;

  /**
   * Text that would be displayed for option
   */
  displayText: string;

  /**
   * Whether or not option is selected
   */
  selected?: boolean;

  /**
   * Child nodes of the option
   */
  nodes?: IsSelectNode[];
}
