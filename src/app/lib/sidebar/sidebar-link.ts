/**
 * SidebarLink interface used in the legacy sidebar
 * implementation
 */
export class IsSidebarLink {

  /**
   * The link of the sidebar item, its attached to the <a> tag.
   */
  link: string;

  /**
   * The Label of the sidebar item, its attached to the <a> tag.
   */
  label: string;

  /**
   * The icon on the sidebar item.
   */
  icon: string;
}
