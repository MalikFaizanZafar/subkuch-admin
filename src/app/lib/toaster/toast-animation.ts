import {
  trigger,
  state,
  style,
  transition,
  animate,
  AnimationTriggerMetadata
} from '@angular/animations';

/**
 * Toast animation transformation rule
 */
const animation = '0.4s cubic-bezier(0.23, 1, 0.32, 1)';

/**
 * Toast animation rule
 * Transitions Opacity/Transform values
 * when component enters from void state to any state
 * and when component enters from any state to void state
 * void => component does not exist in dom
 */
export const flyInOut: AnimationTriggerMetadata = trigger('flyInOut', [
  state('in', style({ opacity: '1', transform: 'translateX(0)' })),
  transition('void => *', [
    style({
      opacity: 0,
      transform: 'translateX(-40px) scale(0.9)'
    }),
    animate(animation)
  ]),
  transition('* => void', [
    animate(animation, style({
      opacity: 0,
      transform: 'translateX(30px) scale(0.9)'
    }))
  ])
]);
