import {
  animate,
  style,
  state,
  transition,
  trigger,
  AnimationTriggerMetadata
} from '@angular/animations';

/**
 * Fade in transition
 * Transitions opacity from 0 to 1
 * when component enters from void state to any state
 * Transitions opacity from 1 to 0
 * when component enters from any state to void state
 * void => component does not exist in dom
 */
export const fadePortal: AnimationTriggerMetadata = trigger('fadePortal', [
  state('in', style({ opacity: '1' })),
  transition('void => *', [
    style({
      opacity: 0,
    }),
    animate('.4s ease')
  ]),
  transition('* => void', [
    animate('.4s ease', style({
      opacity: 0,
    }))
  ])
]);
