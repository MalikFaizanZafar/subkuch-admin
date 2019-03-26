/**
 * Created by egonzalez<edgard.gonzalez@aurea.com> on 06/02/2017.
 */
import {
  Component,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { IsUserProfilePlacement } from './user-profile-placement';
import { IsDropdownPlacement } from '../dropdown';
import { IsBootstrapColor } from '../core/shared/model/bootstrap-color';

@Component({
  selector: 'is-user-profile',
  templateUrl: 'user-profile.html',
  host: { class: 'is-user-profile' },
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./user-profile.scss']
})
export class IsUserProfile {
  /**
   * Whether ot not is an invalid image
   */
  invalidImg = false;

  /**
   * User name
   */
  @Input() public userName = '';

  /**
   * Image path
   */
  @Input() public image = '';

  /**
   * The image avatar of the user can be placed either to
   * the left or right of welcome text. By default it is kept at right.
   * @example
   * avatarPlacement = IsUserProfilePlacement.Left
   */
  @Input() avatarPlacement: IsUserProfilePlacement = IsUserProfilePlacement.Right;

  /**
   * Whether or not to show welcome message next to avatar. By default it is shown.
   */
  @Input() showMessage = true;

  /**
   * The welcome message shown to the user.
   */
  @Input() welcomeMessage = 'Welcome';

  /**
   * The placement of dropdown
   * "top", "top-left", "top-right", "bottom",
   * "bottom-left", "bottom-right", "left", "left-top",
   * "left-bottom", "right", "right-top", "right-bottom"
   */
  @Input() dropdownPlacement: IsDropdownPlacement = IsDropdownPlacement.BottomRight;

  /**
   * User profile text color. Any hex color value accepted.
   */
  @Input() color: string;

  /**
   * User profile text color
   * Available all bootstrap color classes
   */
  @Input() bootstrapColor: IsBootstrapColor;

  /**
   * Should hide image
   */
  hideImage() {
    this.invalidImg = true;
  }

  /**
   * Checks if avatar is to be placed left of welcome message.
   */
  isLeft(): boolean {
    return this.avatarPlacement === IsUserProfilePlacement.Left;
  }

  /**
   * Returns the bootstrap class that corresponds to the input
   * bootstrap's color
   */
  getBootstrapColorClass(): string {
    return this.bootstrapColor ? `text-${this.bootstrapColor}` : '';
  }
}
