import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  ViewEncapsulation
} from '@angular/core';
import { badgeAnimation } from './badge.animation';
import { IsPlacement, IsTheme } from '../core';

@Component({
  selector: 'is-badge',
  templateUrl: 'badge.html',
  styleUrls: ['badge.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [badgeAnimation]
})
export class IsBadge implements OnChanges {
  _count = 0;

  get count(): number {
    return this._count;
  }

  /**
   * Badge component value
   * @param value
   */
  @Input('count')
  set count( value: number ) {
    // prevent count from getting below 0
    if (value < 0) {
      this._count = 0;
    } else {
      this._count = value;
    }
  }

  /**
   * Badge component placement. Default value `IsPlacement.TopRight`
   */
  @Input()
  placement: IsPlacement = IsPlacement.TopRight;

  /**
   * Badge component theme. Default value `IsTheme.Danger`
   */
  @Input()
  theme: IsTheme = IsTheme.Danger;

  runAnimation = '';

  ngOnChanges( changes: any ): void {
    this.runAnimation = 'in';
  }

  animationComplete() {
    this.runAnimation = '';
  }
}
