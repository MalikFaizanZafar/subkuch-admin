import {
  Directive,
  ElementRef,
  Input,
  Inject,
  HostListener,
  ComponentFactoryResolver,
  TemplateRef,
  Injector,
  ApplicationRef,
  Output,
  EventEmitter,
  Optional,
  OnInit,
  OnDestroy,
  ComponentRef
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subscription } from 'rxjs/Subscription';
import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal';
import { Platform } from '@angular/cdk/platform';

import {
  IsTheme,
  BODY_TOKEN,
  DOCUMENT_TOKEN,
  mapProperties,
  IsMouseUpService,
  isIEBrowser
} from '../core/index';
import { IsTooltipPosition } from './tooltip.models';
import { IsToolTip } from './tooltip';
import { IsTooltipTriggerType } from './tooltip-trigger.types';
import { IsTooltipOptions } from './tooltip.options';
import { TOOLTIP_CONFIG } from './tooltip.config';
import { IsTooltipAlignment } from './tooltip-alignment';
import { IsTooltipSize } from './tooltip-size';

@Directive({
  selector: '[isToolTip]',
  exportAs: 'isToolTip',
  host: {
    '[tabindex]': '0'
  }
})
export class IsToolTipDirective implements OnInit, OnDestroy {

  /**
   * Subscription to handle mouse up event.
   */
  private mouseUpSubscription: Subscription;

  /**
   * Holds component reference depending upon type of loader.
   */
  private componentRef: ComponentRef<IsToolTip>;

  /**
   * Reference to our Portal.
   * This is the portal we'll use to attach our TooltipComponent.
   */
  private toolTipBarPortal: ComponentPortal<IsToolTip>;

  /**
   * Reference to our Portal Host.
   * We use containerPortalHost as we'll be using document.body as our anchor.
   */
  private containerPortalHost: DomPortalHost;

  /**
   * Whether or not to show tooltip on input focus. Must be true/false.
   * Default is false.
   */
  private _isToolTipFocus: boolean;

  /**
   * Use this propery if the element with tooltip is inside overflow:hidden element.
   * Must be true/false. Default is false
   */
  private _isToolTipFixed: boolean;

  /**
   * Whether or not to show tooltip on click. Must be true/false.
   */
  private _isToolTipShowOnClick = false;

  /**
   * Whether or not tooltip is a circle. Must be true/false.
   * Circle tooltip is best for small content.
   * Default is false.
   */
  private _isCircle = false;

  /**
   * Whether or not the tooltip should be disabled.
   */
  private _disabled = false;

  /**
   * Tooltip text
   */
  @Input()
  isToolTip: string;

  /**
   * Tooltip position - topleft, top, topright, bottomleft, bottom, bottomright, left, right.
   * Default is top.
   */
  @Input()
  isToolTipPlacement: IsTooltipPosition;

  /**
   * Tooltip color - primary, success, info, warning danger, light.
   */
  @Input()
  isToolTipColor: IsTheme;

  /**
   * Whether or not to show tooltip on input focus. Must be true/false.
   * Default is false.
   */
  @Input()
  get isToolTipFocus() {
    return this._isToolTipFocus;
  }
  set isToolTipFocus(value) {
    this._isToolTipFocus = coerceBooleanProperty(value);
  }

  /**
   * Use this propery if the element with tooltip is inside overflow:hidden element.
   * Must be true/false. Default is false.
   */
  @Input()
  get isToolTipFixed() {
    return this._isToolTipFixed;
  }
  set isToolTipFixed(value) {
    this._isToolTipFixed = coerceBooleanProperty(value);
  }

  /**
   * Whether or not to show tooltip on click. Must be true/false.
   */
  @Input()
  get isToolTipShowOnClick() {
    return this._isToolTipShowOnClick;
  }
  set isToolTipShowOnClick(value) {
    this._isToolTipShowOnClick = coerceBooleanProperty(value);
  }

  /**
   * Custom template for tooltip.
   */
  @Input()
  istoolTipTemplate: TemplateRef<any> = null;

  /**
   * This is data for tooltip
   */
  @Input()
  istoolTipData: any;

  /**
   * Whether or not tooltip is a circle. Must be true/false.
   * Circle tooltip is best for small content.
   * Default is false.
   */
  @Input()
  get isCircle() {
    return this._isCircle;
  }
  set isCircle(value) {
    this._isCircle = coerceBooleanProperty(value);
  }

  /**
   * To be used to add the tooltip in the body tag.
   */
  @Input()
  container: string;

  /**
   * To be used to set the event type for showing the tooltip.
   */
  @Input()
  trigger: IsTooltipTriggerType;

  /**
   * Whether or not the tooltip should be disabled.
   */
  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = coerceBooleanProperty(value);
  }

  /**
   * To be used to show the tooltip with some delay.
   */
  @Input()
  isTooltipShowDelay: number;

  /**
   * To be used to hide the tooltip with some delay.
   */
  @Input()
  isTooltipHideDelay: number;

  /**
   * Options to be applied on the component when
   * the component will be declared.
   */
  @Input()
  options: IsTooltipOptions;

  /**
   * Whether or not the tooltip is visible.
   */
  @Output()
  visibilityChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * To be used to set the timer for showing the tooltip.
   */
  private showTimeOutId = null;

  /**
   * To be used to set the timer for hiding the tooltip.
   */
  private hideTimeOutId = null;

  /**
   * To be used to set the host element for the tooltip.
   */
  host: HTMLElement;

  /**
   * Tooltip component
   */
  tooltip: IsToolTip;

  /**
   * @hidden
   * Tooltip position
   */
  private toolTipPosition: IsTooltipAlignment;

  /**
   * @hidden
   * Position of the host element
   */
  private hostPosition: IsTooltipAlignment;

  /**
   * @hidden
   * Size of the host element
   */
  private hostSizes: IsTooltipSize;

  /**
   * Whether or not tooltip is show from outside
   */
  private shownFromOutside = false;

  /**
   * Whether or not the browser is IE.
   */
  isIE = isIEBrowser(this.platform);

  /**
   * Constructor of the component
   * @param componentFactoryResolver
   * @param el
   * @param injector
   * @param appRef
   * @param mouseUpSubscriber
   * @param platform
   * @param bodyElement
   * @param document
   * @param config
   */
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private el: ElementRef,
    private injector: Injector,
    private appRef: ApplicationRef,
    private mouseUpSubscriber: IsMouseUpService,
    private platform: Platform,
    @Inject(BODY_TOKEN)
    private bodyElement: any,
    @Inject(DOCUMENT_TOKEN)
    private document: any,
    @Optional() @Inject(TOOLTIP_CONFIG)
    private config: IsTooltipOptions) {
    // Create a Portal based on the Tooltip
    this.toolTipBarPortal = new ComponentPortal(IsToolTip);
  }

  /**
   * Setting the global options on component initialization.
   * @see OnInit
   */
  ngOnInit() {
    this.options = this.getOptions();
    this.setInputValues();
    if (this.trigger === IsTooltipTriggerType.Click || this.isToolTipShowOnClick) {
      this.mouseUpSubscription = this.mouseUpSubscriber
        .onMouseUp
        .subscribe(this.clickOutsideTooltip.bind(this));
    }
    this.addEvents();
  }

  /**
   * To be used to addEvents depending on the platform used.
   */
  addEvents() {
    // Removed HostListener because there are no conditional host listener.
    // Don't want to bind pointer events for browsers other than IE and
    // for IE don't want to bind the mouseevents to improve the performance.
    if (this.isIE) {
      this.el.nativeElement.addEventListener('pointerenter', this.onHover.bind(this));
      this.el.nativeElement.addEventListener('pointerleave', this.onHoverOut.bind(this));
    } else {
      this.el.nativeElement.addEventListener('mouseenter', this.onHover.bind(this));
      this.el.nativeElement.addEventListener('mouseleave', this.onHoverOut.bind(this));
      this.el.nativeElement.addEventListener('touchstart', this.onHover.bind(this));
      this.el.nativeElement.addEventListener('touchend', this.onHoverOut.bind(this));
    }
  }

  /**
   * To be used to map the input values.
   */
  setInputValues() {
    this.isToolTipPlacement = this.options.placement;
    this.isTooltipShowDelay = this.options.showDelay;
    this.isTooltipHideDelay = this.options.hideDelay;
    this.trigger = this.options.trigger;
  }

  /**
   * Return the configuration options for tooltip.
   */
  getOptions(): IsTooltipOptions {
    // should get default options.
    const defaultOptions = new IsTooltipOptions;
    // should copy default options first then global options
    // and then will assign the page level options.
    const options = Object.assign({}, defaultOptions, this.config, this.options);

    mapProperties(options, {
      trigger: this.trigger,
      placement: this.isToolTipPlacement,
      showDelay: this.isTooltipShowDelay,
      hideDelay: this.isTooltipHideDelay
    });

    return options;
  }

  /**
   * Callback method on hovering the component.
   */
  onHover() {
    if (!this.isToolTipFocus && !this.isToolTipShowOnClick && this.trigger === IsTooltipTriggerType.Hover) {
      this.createTooltip();
    }
  }

  /**
   * Callback method on hovering out of the component.
   */
  onHoverOut() {
    if (!this.isToolTipFocus && !this.isToolTipShowOnClick && this.trigger === IsTooltipTriggerType.Hover) {
      this.removeTooltip();
    }
  }

  /**
   * Callback method when blur event is called
   */
  @HostListener('click')
  onClick() {
    if (this.isToolTipShowOnClick || this.trigger === IsTooltipTriggerType.Click) {
      this.show();
    }
  }

  /**
   * Callback method when focus event is called
   */
  @HostListener('focusin')
  hostFocus() {
    if (this.isToolTipFocus || this.trigger === IsTooltipTriggerType.Focus) {
      this.createTooltip();
    }
  }

  /**
   * Callback method when blur event is called
   */
  @HostListener('focusout')
  hostBlur() {
    if (this.isToolTipFocus || this.trigger === IsTooltipTriggerType.Focus) {
      this.removeTooltip();
    }
  }

  /**
   * This method is used to hide the tooltip when document is clicked
   */
  clickOutsideTooltip(event: Event) {
    if (this.shownFromOutside && this.tooltip && !this.el.nativeElement.contains(event.target)) {
      this.removeTooltip();
      this.shownFromOutside = false;
    }
  }

  /**
   * To be used to show the tooltip if trigger
   * property is set as manual or click.
   */
  show() {
    if (this.isTooltipAllowed) {
      this.shownFromOutside = true;
      this.createTooltip();
    }
  }

  /**
   * To be used to hide the tooltip if trigger
   * property is set as manual.
   */
  hide() {
    if (this.trigger === IsTooltipTriggerType.Manual && this.shownFromOutside && this.tooltip) {
      this.removeTooltip();
      this.shownFromOutside = false;
    }
  }

  /**
   * Whether or not the tooltip can be shown manually.
   */
  get isTooltipAllowed(): boolean {
    return this.isToolTipShowOnClick ||
      this.trigger === IsTooltipTriggerType.Click ||
      this.trigger === IsTooltipTriggerType.Manual;
  }

  /**
   * This method is used to show the tooltip.
   * @deprecated -Show method will be used for same purpose
   * if trigger property will be set as click or manual.
   */
  showToolTip() {
    this.show();
  }

  /**
   * This function is used to create the tooltip
   */
  createTooltip() {
    if (!this.isToolTip) {
      console.warn('Tooltip text is missing:', this.el.nativeElement);
      return;
    }
    if (this.disabled) {
      return;
    }
    if (!this.tooltip) {
      this.setHostElement();
      this.createDomPortal();
      this.setTooltip();
      this.alignToolTip();
      this.setTooltipVisible();
    }
  }

  /**
   * To be used to set the host element.
   */
  setHostElement() {
    if (!this.container) {
      this.host = this.el.nativeElement.parentElement;
    } else if (this.container !== 'body') {
      const hostElement = this.document.querySelector(this.container);
      if (hostElement) {
        this.host = <HTMLElement> hostElement;
      } else {
        this.host = this.bodyElement;
      }
    } else {
      this.host = this.bodyElement;
    }
  }

  /**
   * To be used to show the tooltip with some delay.
   */
  setTooltipVisible() {
    if (this.hideTimeOutId) {
      clearTimeout(this.hideTimeOutId);
    }
    this.showTimeOutId = setTimeout(() => {
      this.tooltip.visible = true;
      this.visibilityChange.emit(this.tooltip.visible);
    }, this.isTooltipShowDelay);
  }

  /**
   * To be used to set the dom portal.
   */
  createDomPortal() {
    if (this.containerPortalHost) {
      this.containerPortalHost.detach();
    }
    this.containerPortalHost = new DomPortalHost(
      this.host,
      this.componentFactoryResolver,
      this.appRef,
      this.injector);

    // Attach the Portal to the PortalHost.
    this.componentRef = this.containerPortalHost.attachComponentPortal(this.toolTipBarPortal);
    this.tooltip = <IsToolTip> this.componentRef.instance;
  }

  /**
   * To be used to set the tooltip values.
   */
  setTooltip() {
    this.tooltip.toolTipText = this.isToolTip;
    this.tooltip.toolTipTemplate = this.istoolTipTemplate;
    this.tooltip.toolTipData = this.istoolTipData;
    this.hostSizes = {
      width: this.el.nativeElement.offsetWidth,
      height: this.el.nativeElement.offsetHeight
    };
    if (this.isToolTipFixed || this.host === this.bodyElement) {
      this.hostPosition = this._getElementOffset(this.el.nativeElement);
    } else if (this.container && this.container !== 'body') {
      this.hostPosition = this.getElementOffsetByContainer();
    } else {
      this.hostPosition = {
        top: this.el.nativeElement.offsetTop,
        left: this.el.nativeElement.offsetLeft
      };
    }
  }

  /**
   * To be used to set the position of the tooltip with respect
   * to the given container element.
   */
  getElementOffsetByContainer(): IsTooltipAlignment {
    const elPosition = this.host.getBoundingClientRect();
    let curleft = 0;
    let curtop = 0;
    let obj = this.el.nativeElement;
    while (obj) {
      curleft += (obj.offsetLeft - obj.scrollLeft + obj.clientLeft);
      curtop += (obj.offsetTop - obj.scrollTop + obj.clientTop);
      obj = obj.offsetParent;
    }
    return {
      top: curtop + this.host.scrollTop - elPosition.top,
      left: curleft + this.host.scrollLeft - elPosition.left
    };
  }

  /**
   * Remove tooltip from the DOM
   */
  removeTooltip() {
    if (!this.tooltip) {
      return;
    }
    if (this.showTimeOutId) {
      clearTimeout(this.showTimeOutId);
    }
    this.hideTimeOutId = setTimeout(() => {
      this.tooltip.visible = false;
      this.visibilityChange.emit(this.tooltip.visible);
      this.tooltip = null;
      if (this.containerPortalHost) {
        this.containerPortalHost.detach();
      }
    }, this.isTooltipHideDelay);
  }

  /**
   * Calculate tooltip position
   */
  private alignToolTip() {
    let tooltipTop: number;
    let tooltipLeft: number;

    switch (this.isToolTipPlacement) {
      case IsTooltipPosition.Top:
        tooltipTop = this.hostPosition.top;
        tooltipLeft = this.hostPosition.left + this.hostSizes.width / 2;
        break;
      case IsTooltipPosition.TopLeft:
        tooltipTop = this.hostPosition.top;
        tooltipLeft = this.hostPosition.left;
        break;
      case IsTooltipPosition.TopRight:
        tooltipTop = this.hostPosition.top;
        tooltipLeft = this.hostPosition.left + this.hostSizes.width;
        break;
      case IsTooltipPosition.Bottom:
        tooltipTop = this.hostPosition.top + this.hostSizes.height;
        tooltipLeft = this.hostPosition.left + this.hostSizes.width / 2;
        break;
      case IsTooltipPosition.BottomLeft:
        tooltipTop = this.hostPosition.top + this.hostSizes.height;
        tooltipLeft = this.hostPosition.left;
        break;
      case IsTooltipPosition.BottomRight:
        tooltipTop = this.hostPosition.top + this.hostSizes.height;
        tooltipLeft = this.hostPosition.left + this.hostSizes.width;
        break;
      case IsTooltipPosition.Left:
        tooltipTop = this.hostPosition.top + this.hostSizes.height / 2;
        tooltipLeft = this.hostPosition.left;
        break;
      case IsTooltipPosition.Right:
        tooltipTop = this.hostPosition.top + this.hostSizes.height / 2;
        tooltipLeft = this.hostPosition.left + this.hostSizes.width;
        break;
    }
    this.toolTipPosition = {
      top: tooltipTop,
      left: tooltipLeft
    };

    this.tooltip.position = this.toolTipPosition;
    this.tooltip.className = `${this.getPlacementClass()} ${this.getThemeClass()} ${this.getFixedClass()}`;
    this.tooltip.className = `${this.tooltip.className} ${this.getCircleClass()}`;
  }

  /**
   * Get circle class
   */
  private getCircleClass() {
    return this.isCircle ? 'circle' : '';
  }

  /**
   * Get Placement class
   */
  private getPlacementClass() {
    return `is-tooltip--${this.isToolTipPlacement}`;
  }

  /**
   * Get Theme class
   */
  private getThemeClass() {
    return this.isToolTipColor ? this.isToolTipColor : '';
  }

  /**
   * Get class for isToolTipFixed property
   */
  private getFixedClass() {
    return this.isToolTipFixed ? 'fixed' : '';
  }

  /**
   * Returns the position of DOM element
   * @param el
   */
  private _getElementOffset(el): IsTooltipAlignment {
    let _x = 0;
    let _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: _y, left: _x };
  }

  /**
   * To be used to un-register the mouse up event listener, clear
   * the timers and removes the DomPortal on destroy life cycle.
   */
  ngOnDestroy() {
    if (this.containerPortalHost) {
      this.containerPortalHost.detach();
    }
    if (this.showTimeOutId) {
      clearTimeout(this.showTimeOutId);
    }
    if (this.hideTimeOutId) {
      clearTimeout(this.hideTimeOutId);
    }
    if (this.mouseUpSubscription) {
      this.mouseUpSubscription.unsubscribe();
    }
  }
}
