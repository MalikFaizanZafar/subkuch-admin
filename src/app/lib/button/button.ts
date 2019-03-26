import {
  Component,
  ViewEncapsulation,
  Input,
  ChangeDetectionStrategy,
  Directive,
} from '@angular/core';
import { IsButtonTheme } from './button-theme';
import { IsButtonSize } from './button-size';

/**
 * Directive whose purpose is to add the white- CSS styling to this selector.
 */
@Directive({
  selector: 'button[is-white-button], a[is-button]',
  host: {
    '[class.is-button--white]': 'true'
  }
})
export class IsWhiteButtonStyler { }

/**
 * Directive whose purpose is to add the size- CSS styling to this selector.
 */
@Directive({
  selector: 'button[is-large-button], a[is-large-button]',
  host: { 'class': 'is-button--large' }
})

export class IsLargeButtonStyler { }

/**
 * Directive whose purpose is to add the size- CSS styling to this selector.
 */
@Directive({
  selector:
  'button[is-small-button], a[is-small-button]',
  host: { 'class': 'is-button--small' }
})

export class IsSmallButtonStyler { }

/**
 * Directive whose purpose is to add the block style- CSS styling to this selector.
 */
@Directive({
  selector:
  'button[is-block-button], a[is-block-button]',
  host: { 'class': 'is-button--block' }
})

export class IsBlockButtonStyler { }

/**
 * Directive whose purpose is to add the full width of container
 * CSS styling to this selector.
 */
@Directive({
  selector:
  'button[is-full-button], a[is-full-button]',
  host: { 'class': 'is-button--full' }
})

export class IsFullButtonStyler { }

/**
 * Directive whose purpose is to add the clear- CSS styling to this selector.
 */
@Directive({
  selector: 'button[is-clear-button], a[is-clear-button], ',
  host: {
    '[class.is-button--clear]': 'true'
  }
})
export class IsClearButtonStyler { }

/**
 * Directive whose purpose is to add the bordered- CSS styling to this selector.
 */
@Directive({
  selector: 'button[is-border-button], a[is-border-button], ',
  host: {
    '[class.is-button--bordered]': 'true'
  }
})
export class IsBorderButtonStyler { }

@Component({
  selector: 'button[is-button], a[is-button]',
  templateUrl: 'button.html',
  styleUrls: ['button.scss'],
  host: {
    '[class.is-button]': 'true',
    '[style.background-color]': 'color', // the value should be in hex form
    '[class.is-button--loading]': 'loading',
    '[class.is-button--loader-after]': 'loaderPosition === "after"',
    '[class.primary]': 'theme === "primary"',
    '[class.dark]': 'theme === "dark"',
    '[class.light]': 'theme === "light"',
    '[class.success]': 'theme === "success"',
    '[class.warning]': 'theme === "warning"',
    '[class.danger]': 'theme === "danger"',
    '[class.info]': 'theme === "info"'
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsButton {

  /***
  * Color to be used as background of the button
  */
  @Input()
  color: string;

  /***
  * LoaderPosition to be used for the positon of loading icon
  * Place the loader 'before' the content by default
  */
  @Input()
  loaderPosition = 'before';

  /***
  * Whether or not to show the loading icon
  */
  @Input()
  loading = false;

  /***
  * Size to be used for the height, width and font-size
  * of the button relative to container size,
  * options are 'large', 'small' and 'default'
  * if not set then it will be 'default'
  */
  @Input()
  size: IsButtonSize = 'default';

  /***
  * Theme to be used to set the background and text color
  * options are 'primary', 'dark', 'light', 'success', 'warning'
  * 'info' and 'danger'
  */
  @Input()
  theme: IsButtonTheme;

  /***
  * StartLoading function to be used to show the loading icon
  */
  startLoading() {
    this.loading = true;
  }

  /***
  * StopLoading function to be used to hide the loading icon
  */
  stopLoading() {
    this.loading = false;
  }

}
