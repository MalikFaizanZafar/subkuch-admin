import {
  animate,
  animateChild,
  AnimationTriggerMetadata,
  query,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

/**
 * Animation rule
 * Transitions opacity values
 * when component will show and hide.
 */
export const fadeInOut: AnimationTriggerMetadata = trigger('fadeInOut', [
  state('in', style({transform: 'translateX(0)', height: '*'})),
  transition('void => *', [
    style({
      opacity: 0
    }),
    animate('0.4s cubic-bezier(0.23, 1, 0.32, 1)')
  ]),
  transition('* => void', [
    animate(
      '0.4s cubic-bezier(0.23, 1, 0.32, 1)',
      style({
        opacity: 0
      })
    )
  ])
]);

/**
 * Animation rule
 * Transitions height/opacity values
 * when component collapse and expand.
 */
export const slide: AnimationTriggerMetadata =
  // trigger name for attaching this animation to an element using the [@triggerName] syntax
  trigger('slide', [
    state(
      'in',
      style({
        height: '*',
        opacity: 1
      })
    ),
    transition('void => *', [
      style({
        height: 0,
        opacity: 0
      }),
      animate('600ms cubic-bezier(0.165, 0.84, 0.44, 1)')
    ]),
    transition('* => void', [
      animate(
        '600ms cubic-bezier(0.165, 0.84, 0.44, 1)',
        style({
          height: 0,
          opacity: 0
        })
      )
    ])
  ]);

/**
 * Used to trigger enter/leave animations on child components
 */
export const ngIfChildAnimation: AnimationTriggerMetadata = trigger('ngIfChildAnimation', [
  transition(':enter, :leave', query('@*', animateChild(), { optional: true }))
]);
