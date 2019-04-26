import {
  trigger,
  style,
  animate,
  transition,
  AnimationTriggerMetadata
} from '@angular/animations';


export const timePickerFadeInOut: AnimationTriggerMetadata = trigger('focusedState', [
  transition('void => *', [
    style({
      opacity: 0,
      transform: 'translateY(15px)'
    }),
    animate('0.25s ease-out')
  ]),
  transition('* => void', [
    animate('0.25s ease-out', style({
      opacity: 0,
      transform: 'translateY(15px)'
    }))
  ])
]);
