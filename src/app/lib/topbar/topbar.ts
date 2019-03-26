import { EventEmitter, Output } from '@angular/core';
/**
 * Created by egonzalez<edgard.gonzalez@aurea.com> on 06/02/2017.
 */
import {
  Component, Input, ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { IsTopbarLink } from './topbar-link';

/**
 * Class used to create top bar with left, center and right content
 * It can render IsTopbarLogo and IsTopbarLinks as required
 */
@Component({
  selector: 'is-topbar',
  templateUrl: 'topbar.html',
  styleUrls: ['topbar.scss'],
  host: {
    class: 'is-topbar'
  },
  exportAs: 'topbar',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsTopbar {
  /**
   * Toggles topbar fluid mode on/off
   * @var { boolean } fluid
   */
  @Input()
  public fluid = true;
  /**
   * Auto generates links inside the
   * center container on the topbar
   * @var { IsTopbarLink[] } links
   */
  @Input()
  links: IsTopbarLink[];

  /**
   * Event emitted on hamburguer click
   * @memberof IsTopbar
   */
  @Output()
  hamburgerClick: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emits an event on the hamburgerClick prop when the hamburger button
   * is clicked
   * @memberof IsTopbar
   */
  onHamburguerClick() {
    this.hamburgerClick.next();
  }
}
