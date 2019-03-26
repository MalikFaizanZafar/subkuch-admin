import {
  Component,
  ViewEncapsulation,
  HostBinding,
  ElementRef,
  Directive,
  ViewContainerRef,
  TemplateRef,
  ViewChild,
  OnInit,
  EmbeddedViewRef
} from '@angular/core';
import { tooltipAnimation } from './tooltip.animation';
import { IsTooltipAlignment } from './tooltip-alignment';

/**
 * The tooltip's host container
 */
@Directive({ selector: '[isToolTipContainer]' })
export class IsToolTipContainer {
  /**
   * The view container ref associated to this host
   */
  vcr: ViewContainerRef;

  /**
   * Creates an instance of IsToolTipContainer.
   */
  constructor(vcr: ViewContainerRef) {
    this.vcr = vcr;
  }
}

@Component({
  selector: 'tooltip',
  templateUrl: './tooltip.html',
  styleUrls: ['./tooltip.scss'],
  animations: [tooltipAnimation],
  encapsulation: ViewEncapsulation.None
})
export class IsToolTip implements OnInit {

  /**
   * To be used to set the css classes.
   */
  private _className = '';

  /**
   * Tooltip position
   */
  private _position: IsTooltipAlignment = {
    top: -100,
    left: -100
  };

  /**
   * Tooltip text
   */
  public toolTipText = '';

  /**
   * Css class name for tooltip
   */
  get className() {
    return this._className;
  }
  set className(value) {
    this._className = value;
    this.classArray = `is-tooltip ${this._className}`;
  }

  /**
   * To be used to set the css classes.
   */
  @HostBinding('class')
  classArray: string;

  /**
   * Tooltip position
   */
  get position() {
    return this._position;
  }
  set position(value) {
    this._position = value;
    this.topPostion = this._position.top;
    this.leftPosition = this._position.left;
  }

  /**
   * To be used to set the top position of the tooltip.
   */
  @HostBinding('style.top.px')
  topPostion: number;

  /**
   * To be used to set the left position of the tooltip.
   */
  @HostBinding('style.left.px')
  leftPosition: number;

  /**
   * Custom template for tooltip
   */
  public toolTipTemplate: TemplateRef<any> = null;

  /**
   * Data for tooltip
   */
  public toolTipData: any;

  /**
   * Host element that contains tooltip
   */
  @ViewChild(IsToolTipContainer)
  container: IsToolTipContainer;

  /**
   * Animation for show/hide tooltip
   */
  @HostBinding('@tooltipAnimation')
  animation = true;

  /**
   * Whether or not the tooltip is visible.
   */
  @HostBinding('class.is-tooltip--visible')
  visible = false;

  /**
   * EmbeddedTemplate for tooltip
   */
  private embeddedTemplate: EmbeddedViewRef<any>;

  constructor(public elRef: ElementRef) {
  }

  /**
   * Initialization method for component
   */
  ngOnInit() {
    if (this.toolTipTemplate) {
      this.embeddedTemplate = this.container.vcr.createEmbeddedView(this.toolTipTemplate);
      this.embeddedTemplate.context.data = this.toolTipData;
    }
  }

}
