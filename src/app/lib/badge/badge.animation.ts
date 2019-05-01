import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
  AnimationTriggerMetadata
} from '@angular/animations';

export const badgeAnimation: AnimationTriggerMetadata = trigger('badgeAnimation', [
  state('in', style({ transform: 'scale(1)' })),
  transition('in => *', animate('.3s ease', keyframes([
    style({ transform: 'scale(1)' }),
    style({ transform: 'scale(1.3)' }),
    style({ transform: 'scale(0.9)' }),
    style({ transform: 'scale(1.1)' }),
    style({ transform: 'scale(1)' })
  ])))
]);
