import { ConnectionPositionPair } from '@angular/cdk/overlay';

/**
 * Interface that acts like an enum,
 * holding information about anchoring for Connection Positions.
 */
export interface IsConnectionPositionPairs {

  /**
   * Represents the top-left position.
   */
  readonly topLeft:  Readonly<ConnectionPositionPair>;

  /**
   * Represents the top-right position.
   */
  readonly topRight:  Readonly<ConnectionPositionPair>;

  /**
   * Represents the top-center position.
   */
  readonly topCenter:  Readonly<ConnectionPositionPair>;

  /**
   * Represents the bottom-left position.
   */
  readonly bottomLeft:  Readonly<ConnectionPositionPair>;

  /**
   * Represents the bottom-right position.
   */
  readonly bottomRight: Readonly<ConnectionPositionPair>;

  /**
   * Represents the bottom-center position.
   */
  readonly bottomCenter: Readonly<ConnectionPositionPair>;

  /**
   * Represents the left position.
   */
  readonly left: Readonly<ConnectionPositionPair>;

  /**
   * Represents the right position.
   */
  readonly right: Readonly<ConnectionPositionPair>;
}

/**
 * Constant that defines anchoring options for
 * position pairs.
 */
export const POSITION_PAIRS: IsConnectionPositionPairs = {
  topLeft: {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetX: 0,
    offsetY: 0
  },
  topRight: {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetX: 0,
    offsetY: 0
  },
  topCenter: {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
    offsetX: 0,
    offsetY: 0
  },
  bottomLeft: {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetX: 0,
    offsetY: 0
  },
  bottomRight: {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
    offsetX: 0,
    offsetY: 0
  },
  bottomCenter: {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    offsetX: 0,
    offsetY: 0
  },
  left: {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: 0,
    offsetY: 0
  },
  right: {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: 0,
    offsetY: 0
  },
};

/**
 * Constant that defines anchoring options for
 * position pairs. It renders overlay coming out from the origin.
 */
export const OUTER_POSITION_PAIRS: IsConnectionPositionPairs = {
  ...POSITION_PAIRS,
  topLeft: {
    ...POSITION_PAIRS.topLeft,
    overlayX: 'end'
  },
  topRight: {
    ...POSITION_PAIRS.topRight,
    overlayX: 'start'
  },
  bottomLeft: {
    ...POSITION_PAIRS.bottomLeft,
    overlayX: 'end'
  },
  bottomRight: {
    ...POSITION_PAIRS.bottomRight,
    overlayX: 'start'
  }
};

/**
 * Returns the POSITION_PAIRS with offset. This allows the overlay to be rendered
 * separated from its origin.
 *
 * @param offset - the separation, in pixels, from the overlay to the origin
 * @returns - a set of position pairs
 */
export function getOuterPositionPairsWithOffsets(offset: number): IsConnectionPositionPairs {
  const left: ConnectionPositionPair = { ...OUTER_POSITION_PAIRS.left, offsetX: -offset };
  const right: ConnectionPositionPair = { ...OUTER_POSITION_PAIRS.right, offsetX: offset };
  const topLeft: ConnectionPositionPair = { ...OUTER_POSITION_PAIRS.topLeft, offsetX: -offset, offsetY: -offset };
  const topRight: ConnectionPositionPair = { ...OUTER_POSITION_PAIRS.topRight, offsetX: offset, offsetY: -offset };
  const topCenter: ConnectionPositionPair = { ...OUTER_POSITION_PAIRS.topCenter, offsetY: -offset };
  const bottomLeft: ConnectionPositionPair = { ...OUTER_POSITION_PAIRS.bottomLeft, offsetX: -offset, offsetY: offset };
  const bottomRight: ConnectionPositionPair = { ...OUTER_POSITION_PAIRS.bottomRight, offsetX: offset, offsetY: offset };
  const bottomCenter: ConnectionPositionPair = { ...OUTER_POSITION_PAIRS.bottomCenter, offsetY: offset  };
  return { topLeft, topRight, topCenter, bottomLeft, bottomRight, bottomCenter, left, right };
}
