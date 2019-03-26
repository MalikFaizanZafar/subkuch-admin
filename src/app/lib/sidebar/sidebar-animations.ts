import {
  animate,
  style,
  transition,
  trigger,
  AnimationTriggerMetadata
} from '@angular/animations';

export let mobileOverlayFadeInOut: AnimationTriggerMetadata =
  trigger('fadeInOut', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('.5s ease', style({ 'opacity': 1 }))
    ]),
    transition(':leave', [
      style({ opacity: 1 }),
      animate('.5s ease', style({ 'opacity': 0 }))
    ])
  ]);
