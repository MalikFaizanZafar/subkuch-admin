import {
  Component, ViewEncapsulation, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy, HostListener,
  Renderer2, ElementRef
} from '@angular/core';

import { ToastOptions } from './toast-options';

/**
 * Class for toast component
 */
@Component({
  selector: 'is-toast',
  styleUrls: ['toast.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'options.type + (options.closeOnClick ? " closable" : "")'
  },
  templateUrl: 'toast.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsToast implements OnInit {

  /**
   * Message to be shown
   */
  @Input() message: string;
  /**
   * Toast Options for toaster
   */
  @Input() options: ToastOptions = {};

  /**
   * Close Timeout Event Emitter
   */
  @Output() closeTimeOut = new EventEmitter();
  /**
   * Close button click event emitter
   */
  @Output() onCloseButtonClick = new EventEmitter();

  /**
   * Click on component event emitter
   */
  @Output() onClick = new EventEmitter();

  /**
   * Holds a number that represents the id of a setTimeout return
   * @var {number} timer
   */
  private timer: number;

  /**
   * Callback method called when click event is fired
   */
  @HostListener('click')
  onComponentClick() {
    if (this.options.closeOnClick) {
      this.clearTimeout();
    }
    this.onClick.emit();
  }

  /**
   * Callback method called when mouseleave event is fired
   */
  @HostListener('mouseenter')
  onFocus() {
    this.clearTimeout();
  }

  /**
   * Callback method called when mouseleave event is fired
   */
  @HostListener('mouseleave')
  onBlur() {
    this.setTimeout();
  }

  /**
   * Constructor to create an instance of Toast component
   * @param el reference of the element
   * @param renderer Renderer2 object to listen to events
   */
  constructor(private el: ElementRef,
              private renderer: Renderer2) {}

  /**
   * Initialization method for Toast component
   */
  ngOnInit() {
    this.setTimeout();
    this.renderer.setStyle(
      this.el.nativeElement,
      'width',
      this.options.width
    );
  }

  /**
   * Callback method clicked on click of close button
   */
  closeButtonClick() {
    this.clearTimeout();
    this.onCloseButtonClick.emit();
  }

  /**
   * Clear Timeout for toast
   */
  clearTimeout() {
    if (this.options.hasAutoCloseTime) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /**
   * Set Timeout for toast
   */
  setTimeout() {
    if (this.options.hasAutoCloseTime) {
      this.timer = window.setTimeout(() => {
        this.closeTimeOut.emit(this);
      }, this.options.autoCloseTime);
    }
  }
}
