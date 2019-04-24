import {
  Component,
  Inject,
  Optional,
  ViewChild,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostBinding,
  OnDestroy,
  AfterViewInit,
  Renderer2,
  ElementRef
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';

import {
  mapProperties,
  IsKey,
  BREAKPOINT_CONFIG,
  IsResizeable,
  IsResizeService
} from '../core';
import { fadePortal } from './portal.animation';
import { IsPortalOptions } from './portal-options';
import { IsPortalContent } from './portal-content.directive';
import { PORTAL_CONFIG } from './portal.config';
import { IsPortalOrientation } from './portal-orientation';

/**
 * Class for portal component
 */
@Component({
  selector: 'is-portal',
  templateUrl: './portal.html',
  styleUrls: ['./portal.scss'],
  host: {
    'class': 'is-portal',
    '[class.is-portal--full]': 'showingOverlay'
  },
  animations: [ fadePortal ],
  encapsulation: ViewEncapsulation.None
})
export class IsPortal extends IsResizeable
                      implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  /**
   * Configuration options for portal
   */
  @Input()
  options: IsPortalOptions;

  /**
   * Configuration options for portal for mobile
   */
  @Input()
  mobileOptions: IsPortalOptions;

  /**
   * Whether or not animations should be on
   */
  @Input()
  animationsOn = true;

  /**
   * Whether or not to show backdrop
   */
  @Input()
  showBackdrop: boolean;

  /**
   * Whether or not to show content always
   */
  @Input()
  showTemplateContentAlways: boolean;

  /**
   * Whether or not show close button
   */
  @Input()
  showCloseButton: boolean;

  /**
   * Header title
   */
  @Input()
  headerTitle: string;

  /**
   * Show header
   */
  @Input()
  showHeader: boolean;

  /**
   * Portal orientation
   */
  @Input()
  orientation: IsPortalOrientation;

  /**
   * Height of the portal. If a number is provided, pixel units are assumed.
   * Height should only be provided for Top and Bottom oriented portals.
   * It would be ignored for Left and Right oriented portals
   */
  @Input()
  height: number | string;

  /**
   * Width of the portal. If a number is provided, pixel units are assumed.
   * Width should only be provided for Left and Right oriented portals.
   * It would be ignored for Top and Bottom oriented portals
   */
  @Input()
  width: number | string;

  /**
   * Event emitter for close event
   */
  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Whether or not to show portal
   */
  private _showPortal: boolean;

  /**
   * Show overlay on given condition
   */
  @Input()
  get showPortal(): boolean {
    return this._showPortal;
  }

  set showPortal(value: boolean) {
    this._showPortal = value;
    if (value) {
      this.showingOverlay = true;
      this.addKeyboardListeners();
    } else if (this.showingOverlay) {
      this.closePortal();
    }
  }

  /**
   * Whether or not to close portal on escape
   */
  @Input()
  closeOnEsc: boolean;

  /**
   * Whether or not to close portal on document click
   */
  @Input()
  closeOnBackdropClick: boolean;

  /**
   * Setter for the destroy function
   */
  set destroyFn( fn: Function ) {
    this._destroyFn = fn;
  }

  /**
   * Content management
   */
  @ViewChild(IsPortalContent)
  content: IsPortalContent;

  /**
   * Emits once model might be closed to be subcribed in service and trigger
   * detach. Any data can be passed along in the observer
   */
  onClose: Subject<any> = new Subject<any>();

  /**
   * Emits value once requestAnimationFrame executes
   * within close portal context
   */
  onPortalCloseAnimationEnd: Subject<any> = new Subject<any>();

  /**
   * Function used by this component to destroy itself to close the portal. It
   * will be set by the portal.service which holds the implementation data of
   * this function.
   */
  private _destroyFn: Function;

  /**
   * Whether component or template is provided
   */
  @HostBinding('@fadePortal')
  isTemplateProvided = false;

  /**
   * Whether or not showing the overlay
   */
  showingOverlay = false;

  /**
   * Whether or not the portal is closing
   */
  closing = false;

  /**
   * Mapped options
   */
  mappedOptions: IsPortalOptions;

  /**
   * Element that is focused prior to portal opening
   */
  private elWithFocus: HTMLElement;

  /**
   * Whether or not to use mobile options
   */
  useMobileOptions: boolean;

  /**
   * Subscription for breakpoint
   */
  private breakpointSubscription: Subscription;

  /**
   * Portal close subscription
   */
  private portalCloseSubscription: Subscription;

  /**
   * Holds the keydown listener function that clears the listener
   */
  protected keydownListener?: () => void;

  /**
   * Constructor
   * @param config global configuration option for IsPortal
   * @param resizeService object of IsResizeService
   * @param renderer renderer
   * @param el element reference
   * @param breakpointObserver object of BreakpointObserver
   */
  constructor( @Optional() @Inject(PORTAL_CONFIG) private config: IsPortalOptions,
               resizeService: IsResizeService,
               protected renderer: Renderer2,
               protected el: ElementRef,
               private breakpointObserver: BreakpointObserver ) {
    super(resizeService);
    this.detectBreakpoint();
  }

  /**
   * Detect breakpoint for mobile
   */
  detectBreakpoint() {
    this.breakpointSubscription = this.breakpointObserver
      .observe(BREAKPOINT_CONFIG)
      .subscribe(result => {
        this.useMobileOptions = result.matches;
      });
  }

  /**
   * On window resize
   */
  onResize() {
    this.setMappedOptions();
  }

  /**
   * Callback function after component initialization
   */
  ngOnInit() {
    super.ngOnInit();
    this.setMappedOptions();
    this.elWithFocus = document.activeElement as HTMLElement;
    (this.mappedOptions.classNames || [])
      .forEach((hostClass: string) => {
        this.renderer.addClass(this.el.nativeElement, hostClass);
      });
  }

  /**
   * Callback function after component property changes
   */
  ngOnChanges(changes: SimpleChanges) {
    this.setMappedOptions();
  }

  /**
   * Callback function after component's view initialization
   */
  ngAfterViewInit() {
    this.content.el.nativeElement.focus();
  }

  /**
   * Callback method on destruction of the component
   */
  ngOnDestroy() {
    super.ngOnDestroy();
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

    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }

  /**
   * Set the mapped options
   */
  setMappedOptions() {
    const portalOptions = Object.assign({}, new IsPortalOptions(), this.config, this.getOptions());
    mapProperties(portalOptions, {
      showBackdrop: this.showBackdrop,
      showCloseButton: this.showCloseButton,
      showHeader: this.showHeader,
      headerTitle: this.headerTitle,
      orientation: this.orientation,
      showTemplateContentAlways: this.showTemplateContentAlways,
      animationsOn: this.animationsOn,
      closeOnEsc: this.closeOnEsc,
      closeOnBackdropClick: this.closeOnBackdropClick
    });
    this.mappedOptions = portalOptions;
  }

  /**
   * Get portal options based on the layout: mobile or desktop'
   */
  protected getOptions() {
    return this.useMobileOptions ? this.mobileOptions || this.options : this.options;
  }

  /**
   * Adds the keyboard listener.
   */
  addKeyboardListeners() {
    if (!this.keydownListener) {
      this.keydownListener = this.renderer.listen('window', 'keydown', this.handleKeyboardEvent.bind(this));
    }
  }

  /**
   * Removes the keyboard listener.
   */
  removeKeyboardListeners() {
    if (this.keydownListener) {
      this.keydownListener();
      this.keydownListener = undefined;
    }
  }

  /**
   * To be used to close the portal on esc key.
   * @param event
   */
  handleKeyboardEvent(event: KeyboardEvent) {
    event.stopPropagation();
    const isEscKey = event.key === IsKey.Esc || event.key === IsKey.EscIE;
    // If escape key is pressed
    if (isEscKey && this.showingOverlay && this.mappedOptions.closeOnEsc) {
      this.closePortal();
    }
  }

  /**
   * Callback function on backdrop click
   */
  onBackdropClick() {
    if (this.mappedOptions.closeOnBackdropClick) {
      this.closePortal();
    }
  }

  /**
   * Closes the portal. It will emit an event on the onClose Subject and destroy
   * itself.
   */
  closePortal() {
    this.removeKeyboardListeners();
    this.closing = true;
    this.onPortalClose();

    requestAnimationFrame(() => {
        this.onClose.next();
        // destroys itself calling the function that the service set for this
        // purpose no need to pass a context so we just set it to undefined
        if (this._destroyFn) {
          this._destroyFn.call(undefined);
        }
        setTimeout(() => {
          this.onPortalCloseAnimationEnd.next();
          this.portalCloseSubscription.unsubscribe();
        }, 300);
      }
    );
  }

  /**
   * Initializes subscription to listen to when
   * requestAnimationFrame executes and completes
   * portal close sequence as a consequence
   */
  onPortalClose(): void {
    this.portalCloseSubscription = this.onPortalCloseAnimationEnd.subscribe(() => {
      this.showingOverlay = false;
      this.closing = false;
      this.close.emit();
    });
  }

  /**
   * Whether or not the show header block
   */
  get showHeaderBlock(): boolean {
    return this.showingOverlay &&
      (this.mappedOptions.showHeader || this.mappedOptions.showCloseButton);
  }

  /**
   * Whether or not the backdrop should be hidden.
   */
  get isBackdropVisible(): boolean {
    return this.showingOverlay && this.mappedOptions.showBackdrop;
  }

  /**
   * Get the orientation class
   */
  get orientationClass(): string {
    return this.showingOverlay ?
      `is-portal__container--${this.mappedOptions.orientation}` :
      '';
  }

  /**
   * Whether or not to hide the container
   */
  get hideContainer(): boolean {
    return this.showingOverlay ? false : !this.mappedOptions.showTemplateContentAlways;
  }

  /**
   * Get the container height and width
   */
  get containerStyle(): any {
    const style: any = {};
    if (this.showingOverlay) {
      if (this.isOrientationTop || this.isOrientationBottom) {
        if (this.mappedOptions.height) {
          style['height'] = this.formatCssUnit(this.mappedOptions.height);
        }

        if (this.mappedOptions.maxHeight) {
          style['maxHeight'] = this.formatCssUnit(this.mappedOptions.maxHeight);
        }
      } else if (this.isOrientationLeft || this.isOrientationRight) {
        if (this.mappedOptions.width) {
          style['width'] = this.formatCssUnit(this.mappedOptions.width);
        }

        if (this.mappedOptions.maxWidth) {
          style['maxWidth'] = this.formatCssUnit(this.mappedOptions.maxWidth);
        }
      }
    }
    return style;
  }

  /**
   * Whether or not the orientation is top
   */
  get isOrientationTop(): boolean {
    return this.mappedOptions.orientation === IsPortalOrientation.Top;
  }

  /**
   * Whether or not the orientation is bottom
   */
  get isOrientationBottom(): boolean {
    return this.mappedOptions.orientation === IsPortalOrientation.Bottom;
  }

  /**
   * Whether or not the orientation is left
   */
  get isOrientationLeft(): boolean {
    return this.mappedOptions.orientation === IsPortalOrientation.Left;
  }

  /**
   * Whether or not the orientation is right
   */
  get isOrientationRight(): boolean {
    return this.mappedOptions.orientation === IsPortalOrientation.Right;
  }

  /**
   * Format value to pixel if number
   * @param value
   */
  private formatCssUnit(value: number | string): string {
    return typeof value === 'string' ? value as string : `${value}px`;
  }
}
