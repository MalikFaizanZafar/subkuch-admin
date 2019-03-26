import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { IsModalDismissReasons } from './modal-dismiss-reasons';
import { IsModalOptions } from './modal-options';
import { IsModalSize } from './modal-size';
import { IsModalTemplate } from './modal-template.directive';
import { fadeInOut, fadeUpDelay } from './modal.animation';
import { IsModalConfig } from './modal.base-configuration';
import { MODAL_CONFIG } from './modal.config';

/**
 * Class to create modal
 */
@Component({
  selector: 'is-modal',
  templateUrl: './modal.html',
  styleUrls: ['./modal.scss'],
  host: {'class': 'is-modal'},
  animations: [fadeInOut, fadeUpDelay],
  encapsulation: ViewEncapsulation.None
})
export class IsModal implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Getter for the modal options
   *
   * @readonly
   * @memberof IsModal
   */
  get modalOptions(): IsModalOptions {
    return this._modalOptions;
  }

  /**
   * Setter for the modal options
   *
   * @memberof IsModal
   */
  set modalOptions( options: IsModalOptions ) {
    const defaultOptions = Object.assign({}, new IsModalOptions(), this.globalConfig);
    this._modalOptions = Object.assign({}, defaultOptions, options);
    if (this._modalOptions.customClass) {
      this.setCustomClass(this._modalOptions.customClass);
    }
  }

  /**
   * Setter for the destroy function
   *
   * @memberof IsModal
   */
  set destroyFn( fn: Function ) {
    this._destroyFn = fn;
  }

  /**
   * Indicates whether the modal is being closed or not. Useful to perform any
   * actions prior to component destruction/disposal.
   *
   * @memberof IsModal
   */
  closing = false;

  /**
   * Enables animation
   */
  @HostBinding('@fadeInOut')
  animation = true;

  /**
   * Content management
   */
  @ViewChild(IsModalTemplate)
  content: IsModalTemplate;

  /**
   * Emits once model might be closed to be subcribed in service and trigger
   * detach. Any data can be passed along in the observer
   */
  onClose: Subject<any> = new Subject<any>();

  /**
   * Optional inputs on the modal. This options include custom classes on
   * isModal, like, modal size, backdrop, etc.
   *
   * @memberof IsModal
   */
  private _modalOptions: IsModalOptions;

  /**
   * Function used by this component to destroy itself to close the modal. It
   * will be set by the modal.service which holds the implementation data of
   * this function.
   *
   * @memberof IsModal
   */
  private _destroyFn: Function;

  /**
   * Element that is focused prior to modal opening
   *
   * @memberof IsModal
   */
  private elWithFocus: HTMLElement;

  /**
   * Global configuration for modal
   */
  private globalConfig: IsModalConfig;

  /**
   * Constructor
   * @param el
   * @param config
   */
  constructor( private el: ElementRef,
               @Optional() @Inject(MODAL_CONFIG) private config: IsModalConfig ) {
    this.globalConfig = Object.assign({}, new IsModalConfig(), this.config);
  }

  /**
   * Sets custom class to modal host element.
   * @param cssClass
   */
  setCustomClass( cssClass: string ) {
    this.el.nativeElement.classList.add(cssClass);
  }

  /**
   * Event listener for a click on the backdrop.
   *
   * @memberof IsModal
   */
  onBackdropClick() {
    if (!this.isBackdropStatic()) {
      this.close(IsModalDismissReasons.BACKDROP_CLICK);
    }
  }

  /**
   * Event listener for the ESC key. The listener is set on the main wrapper
   * and will only work if this wrapper is focused.
   *
   * @memberof IsModal
   */
  escKey() {
    this.close(IsModalDismissReasons.ESC);
  }

  /**
   * Closes the modal. It will emit an event on the onClose Subject and destroy
   * itself.
   *
   * @param [reason]
   * @memberof IsModal
   */
  close( reason?: string | IsModalDismissReasons ) {
    this.closing = true;
    requestAnimationFrame(() => {
      this.onClose.next(reason);
      // destroys itself calling the function that the service set for this
      // purpose no need to pass a context so we just set it to undefined
      this._destroyFn.call(undefined);
    });
  }

  /**
   * Whether or not modal is small size.
   */
  isSmallSize() {
    return this._modalOptions.size === IsModalSize.Small;
  }

  /**
   * Whether or not the backdrop should be hidden.
   */
  isBackdropHidden() {
    return this._modalOptions.backdrop === false;
  }

  /**
   * Whether or not the backdrop should not be clickable.
   */
  isBackdropStatic() {
    return this._modalOptions.backdrop === 'static';
  }

  /**
   * Captures element in focus before modal is initiated
   */
  ngOnInit() {
    this.elWithFocus = document.activeElement as HTMLElement;
  }

  ngAfterViewInit() {
    // need to set the focus to the element so that the ESC key can be listened
    // right away
    this.content.el.nativeElement.focus();
  }

  ngOnDestroy(): void {
    // return the focus to the element that was active prior to the modal
    // opening
    const body = document.body;
    const elWithFocus = this.elWithFocus;

    let elementToFocus;
    if (elWithFocus && elWithFocus.focus && body.contains(elWithFocus)) {
      elementToFocus = elWithFocus;
    } else {
      elementToFocus = body;
    }
    elementToFocus.focus();
    this.elWithFocus = null;
  }
}
