/**
 * Interface that defines the structure for
 * auto generated sidebars, it supports multiple levels
 */
export class IsSidebarItemNodes {

  /**
   * The label the item will have.
   */
  label: string;

  /**
   * The link the item will have.
   */
  link?: string;

  /**
   * Whether or not the item is expanded by default.
   */
  expanded?: boolean;

  /**
   * FontAwesome icon class.
   */
  icon?: string;

  /**
   * Extra info passed in aux template.
   */
  auxInfo?: any;

  /**
   * The nodes the item might have, meant for nesting items
   */
  nodes?: Array<IsSidebarItemNodes>;
}
