import {
  trigger,
  style,
  transition,
  animate,
  state,
  AnimationTriggerMetadata
} from '@angular/animations';

export const tooltipAnimation: AnimationTriggerMetadata = trigger('tooltipAnimation', [
  state('false',
    style({
      'opacity': '0'
    })),
  state('true',
    style({
      'opacity': '1'
    })),
    transition('* => *', animate('150ms cubic-bezier(0.4, 0.0, 1, 1)'))
]);
