import { ConnectionPositionPair } from '@angular/cdk/overlay';

export interface IsConnectionPositionPairs {
  readonly topLeft:  Readonly<ConnectionPositionPair>;
  readonly topRight:  Readonly<ConnectionPositionPair>;
  readonly bottomLeft:  Readonly<ConnectionPositionPair>;
  readonly bottomRight: Readonly<ConnectionPositionPair>;
}

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
  }
};
