/**
 * Default configuration for table.
 * By default it omit features on the same breakpoint as the table turns into a list.
 */
import { IsTableConfiguration } from './table-configuration';

export const DEFAULT_CONFIG: IsTableConfiguration = {
  mediaQueryToOmitFeatures: '(max-width: 767px)',
};
