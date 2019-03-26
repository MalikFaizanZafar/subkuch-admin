import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  HostBinding
} from '@angular/core';


/**
 * Class used to create logo in IsTopbar component
 * Takes logo label and name as input
 */
@Component({
  selector: 'is-topbar-logo',
  templateUrl: 'topbar-logo.html',
  styleUrls: ['topbar-logo.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'is-topbar-logo',
  }
})
export class IsTopbarLogo {
  /**
   * Variable that holds the logo background
   * It is used to set the background color
   * of the logo
   */
  @HostBinding('style.backgroundColor')
  @Input()
  public background: string;

  /**
   * Variable that holds the logo Label
   * its going to be inserted inside the logo box
   */
  @Input()
  public label: string;

  /**
   * Variable that holds the logo name
   * its going to be inserted inside the logo <p>
   * attribute
   */
  @Input()
  public name: string;
}
