import {
  animate, keyframes,
  state,
  style,
  transition,
  trigger,
  AnimationTriggerMetadata
} from '@angular/animations';

export const expandCollapseSideBarMenu: AnimationTriggerMetadata =
  trigger('expandCollapse', [
    state('collapsed', style({
      height: '0',
      overflow: 'hidden',
      position: 'relative'
    })),
    state('expanded', style({
      overflow: 'hidden',
      height: '*'
    })),
    transition('collapsed => expanded', animate('0.25s ease', keyframes([
      style({ height: 0, position: 'relative', offset: 0 }),
      style({ height: '*', offset: 1 })
    ]))),
    transition('expanded => collapsed', animate('0.25s ease', keyframes([
      style({ height: '*', offset: 0 }),
      style({ height: '0', position: 'relative', offset: 1 })
    ])))
  ]);


export const nestedExpandCollapseSideBarMenu: AnimationTriggerMetadata =
  trigger('nestedExpandCollapse', [
    state('nested-collapsed', style({
      height: '0',
      overflow: 'hidden',
      position: 'relative'
    })),
    state('nested-expanded', style({
      height: '*'
    })),
    transition('nested-collapsed => nested-expanded', animate('0.25s ease')),
    transition('nested-expanded => nested-collapsed', animate('0.25s ease'))
  ]);
