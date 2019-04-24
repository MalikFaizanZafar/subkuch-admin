import {
  trigger,
  style,
  transition,
  animate,
  state,
  AnimationTriggerMetadata
} from '@angular/animations';

/**
 * Select Options animation rule
 * Transitions Opacity from 0 to 1
 * when component state changes to 'opened'
 * and adds transition values during
 * state change
 */
export const optionsAnimation: AnimationTriggerMetadata = trigger('optionsAnimation', [
  state('opened', style({opacity: '1'})),
  transition('void => *', [
    style({opacity: '0'}),
    animate(200)
  ]),
  transition('* => void', [
    animate(200, style({opacity: '0'}))
  ])
]);
