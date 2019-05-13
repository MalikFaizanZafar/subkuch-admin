/**
 * Default configuration for tables
 *
 * @exportIsTreeViewHelper.
 */
export interface IsTableConfiguration {
  /**
   * The media query/queries to observe and disable reorder/resize/sortable features
   *
   * @memberof IsTableConfiguration
   */
  mediaQueryToOmitFeatures: string | string[];
}
