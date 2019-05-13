import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { TRANSITION_DELAY_MS } from './expandable-row';

/**
 * Creates detail content of a row
 * Handles height transition of detail row
 */
@Component({
  selector: 'is-row-detail, [is-row-detail]',
  templateUrl: 'is-row-detail.html',
  styleUrls: ['./is-row-detail.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-row-detail]': 'true'
  }
})
export class IsRowDetail implements AfterContentInit {
  /**
   * Reference to 'content' child
   */
  @ViewChild('content')
  content;

  /**
   * Transition duration in seconds
   */
  transitionDelay = TRANSITION_DELAY_MS / 1000 + 's';

  /**
   * Lifecycle mthod called after content
   * is initialized. Sets height to 0 initally
   * and in next animation frame it increases to
   * actual height transitionally in mentioned
   * duration
   */
  ngAfterContentInit() {
    requestAnimationFrame(() => {
      const height = this.content.nativeElement.offsetHeight;
      this.content.nativeElement.style.height = 0;
      requestAnimationFrame(() => {
        this.content.nativeElement.style.height = height + 'px';
      });
    });
  }
}
