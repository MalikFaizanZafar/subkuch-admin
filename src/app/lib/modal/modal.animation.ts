import {
  trigger,
  state,
  style,
  transition,
  animate,
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
export const fadeInOut: AnimationTriggerMetadata = trigger('fadeInOut', [
  state('in', style({ opacity: '1' })),
  transition('void => *', [
    style({
      opacity: 0,
    }),
    animate('.4s ease')
  ]),
  transition('* => void', [
    style({ height: '*' }),
    animate('.4s ease', style({
      opacity: 0,
    }))
  ])
]);

/**
 * Fade up transition
 * Transitions opacity from 0 to 1 and transforms on y axis from 12px to 0px
 * when component enters from out state to in state
 * Transitions opacity from 1 to 0 and transforms on y axis from 0px to 12px
 * when component enters from in state to out state
 * void => component does not exist in dom
 */
export const fadeUpDelay: AnimationTriggerMetadata = trigger('fadeUpDelay', [
  state('in', style({ opacity: '1', transform: 'translateY(0)' })),
  state('out', style({ opacity: '0', transform: 'translateY(12px)' })),
  transition('out => in', animate('.5s 100ms ease')),
  transition('in => out', animate('.5s ease'))
]);
