import {
  Component,
  ContentChildren,
  QueryList,
  Input,
  AfterContentChecked,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Optional,
  Inject
} from '@angular/core';
import {
  IsRevealCarouselExpandableDirective
} from './reveal-carousel-expandable';
import {
  IsRevealCarouselBodyDirective
} from './reveal-carousel-body';
import {
  IsRevealCarouselItemDirective
} from './reveal-carousel-item';
import { IsRevealCarouselOptions } from './reveal-carousel-options';
import { REVEAL_CAROUSEL_CONFIG } from './reveal-carousel.config';

@Component({
  selector: 'is-reveal-carousel',
  templateUrl: 'reveal-carousel.html',
  styleUrls: ['reveal-carousel.scss'],
  host: {
    'class': 'is-reveal-carousel'
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsRevealCarousel implements OnInit, AfterContentChecked {

  /**
   * To be used to find the difference between the number
   * of items left to move and the num of visible items.
   */
  private difference = 0;

  /**
   * Options to be applied on the component when
   * the component will be declared.
   */
  @Input()
  options: IsRevealCarouselOptions;

  /**
   * To be used to get the list of items.
   */
  @ContentChildren(IsRevealCarouselItemDirective)
  items: QueryList<IsRevealCarouselItemDirective>;

  /**
   * To be used to get the list of expandable element.
   */
  @ContentChildren(IsRevealCarouselExpandableDirective)
  expandables: QueryList<IsRevealCarouselExpandableDirective>;

  /**
   * To be used to get the list of body element.
   */
  @ContentChildren(IsRevealCarouselBodyDirective)
  bodies: QueryList<IsRevealCarouselBodyDirective>;

  /**
   * To be used to set the index of the hovered item.
   */
  hoveredIdx = -1;

  /**
   * To be used the set the page number.
   */
  carouselOffset = 0;

  /**
   * Whether or not the styles applied on the items container.
   */
  layoutStyled = false;

  /**
   * To be used to set the widht of the items container.
   */
  carouselWidth: number;


  /**
   * Represents the width of each slide in the carousel
   */
  itemWidth: number;

  /**
   * Represents the number of pages depending
   * on the number of visible items.
   */
  navDots: number[] = [];

  /**
   * Constructor of the component
   * @param cRef Apply the changes manually on the DOM.
   * @param globalConfig Global Options that will be declared on invoking the module.
   */
  constructor(
    private cRef: ChangeDetectorRef,
    @Optional() @Inject(REVEAL_CAROUSEL_CONFIG)
    private globalConfig: IsRevealCarouselOptions
  ) { }

  /**
   * To be used to set the options on initialization.
   */
  ngOnInit() {
    const defaultOpts = new IsRevealCarouselOptions();
    this.options = Object.assign({}, defaultOpts, this.globalConfig, this.options);
  }

  /**
   * To be used to set the styles on each template.
   */
  ngAfterContentChecked() {
    this.setStyles();
  }

  /**
   * To be used to set initial style.
   */
  setStyles() {
    if (!this.layoutStyled) {
      this.layoutStyled = this.setBodyLayerStyles() &&
        this.setExpandableLayerStyles();
      this.setLayerStyles();
    }
  }

  /**
   * To be used to set initial styles for the slides list.
   */
  setLayerStyles() {
    if (this.layoutStyled) {
      // build the nav buttons at the bottom
      // number of times the carousel can move
      const numMoves = Math.ceil(this.items.length / this.options.numVisibleItems);
      this.navDots = [];
      for (let i = 0; i < numMoves; i++) {
        this.navDots.push(i);
      }
      this.carouselWidth = (this.itemWidth + this.options.itemSpacing) * this.options.numVisibleItems;
      // as we're using Push as the ChangeDetectionStrategy in this component, it's necessary
      // to manually detect changes to update the carousel width
      this.cRef.detectChanges();
    }
  }

  /**
   * To be used to set initial styles of body templates.
   */
  setBodyLayerStyles() {
    // loop through all the body contents, and adjust the position according to
    // whether it's the first or last item in the visible carousel
    let bodiesStyled = false;
    const bodies = this.bodies.toArray();
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i];
      const idx = i;
      body.elemRef.nativeElement.style.width = `${this.options.scaleFactor * 100}%`;
      const numVisibleItems = this.options.numVisibleItems;
      if (idx % numVisibleItems === 0) {
        body.elemRef.nativeElement.style.left = 0;
      } else if (idx % numVisibleItems === numVisibleItems - 1) {
        body.elemRef.nativeElement.style.left = 'inherit';
      } else {
        body.elemRef.nativeElement.style.left = `${-(this.options.scaleFactor - 1) / 2 * 100}%`;
      }
      bodiesStyled = true;
    }
    return bodiesStyled;
  }

  /**
   * To be used to set initial styles of expandable template.
   */
  setExpandableLayerStyles() {
    // calculate items width, do this only once to avoid reflow
    let expandablesStyled = false;
    const elem = this.expandables.first;
    if (!this.itemWidth && elem) {
      this.itemWidth = elem.elemRef.nativeElement.offsetWidth;
    }
    const expandables = this.expandables.toArray();
    for (let i = 0; i < expandables.length; i++) {
      const item = expandables[i];
      const idx = i;
      const numVisibleItems = this.options.numVisibleItems;
      // items to the left most part of the carousel must expand to the right, and
      // items to the right most part must expand to the left
      if (idx % numVisibleItems === 0) {
        item.elemRef.nativeElement.style.transformOrigin = 'left';
      } else if (idx % numVisibleItems === numVisibleItems - 1) {
        item.elemRef.nativeElement.style.transformOrigin = 'right';
      }
      expandablesStyled = true;
    }
    return expandablesStyled;
  }

  /**
   * To be used to navigate the carousel in backward direction.
   */
  moveCarouselBackward() {
    const itemsLeft = this.getRemainingItems();
    if (itemsLeft >= this.options.numVisibleItems) {
      this.carouselOffset -= this.options.numVisibleItems;
    } else {
      this.difference = this.options.numVisibleItems - itemsLeft;
      this.carouselOffset -= this.options.numVisibleItems - this.difference;
      this.updateStyles();
    }
  }

  /**
   * To be used to navigate the carousel in forward direction.
   */
  moveCarouselForward() {
    if (this.difference) {
      this.carouselOffset += this.options.numVisibleItems - this.difference;
      this.difference = 0;
      this.setBodyLayerStyles();
      this.setExpandableLayerStyles();
    } else {
      this.carouselOffset += this.options.numVisibleItems;
    }
  }

  /**
   * Whether or not the carousel can move backward.
   */
  canMoveCarouselBackward() {
    return this.getRemainingItems() > 0;
  }

  /**
   * Whether or not the carousel can move forward.
   */
  canMoveCarouselForward() {
    return this.carouselOffset === 0;
  }

  /**
   * To be used to calculate the number of pixels each
   * item must move when some other item is hovered.
   * @param idx
   */
  getItemTranslate(idx: number) {
    const numVisibleItems = this.options.numVisibleItems;
    const translateBase = this.itemWidth * ((this.options.scaleFactor - 1) / 2);
    let sign = 1;
    if (this.hoveredIdx !== -1) {
      if (idx < this.hoveredIdx) {
        if ((this.hoveredIdx + this.difference) % numVisibleItems === numVisibleItems - 1) {
          sign = -2;
        } else {
          sign = -1;
        }
      } else if (idx > this.hoveredIdx) {
        if ((this.hoveredIdx + this.difference) % numVisibleItems === 0) {
          sign = 2;
        } else {
          sign = 1;
        }
      } else {
        sign = 0;
      }
      return `translate3d(${sign * translateBase}px, 0, 0)`;
    }
    return 'translate3d(0,0,0)';
  }

  /**
   * To be used to set style on the carousel list.
   */
  getListTranslate() {
    return `translateX(${this.carouselOffset * (this.itemWidth + this.options.itemSpacing)}px)`;
  }

  /**
   * EventEmitter that will be triggered on Mouse Enter
   * and will be used to set styles for zoom out on the
   * base of given scale factor.
   * @param idx
   */
  onItemMouseEnter(idx: number) {
    this.hoveredIdx = idx;
    const hoveredElement = this.expandables.toArray()[idx];
    hoveredElement.elemRef.nativeElement.style.transform = `scale(${this.options.scaleFactor}) translateZ(0)`;
  }

  /**
   * EventEmitter that will be triggered on mouse leave
   * and will reset the styles.
   * @param idx
   */
  onItemMouseLeave(idx: number) {
    this.hoveredIdx = -1;
    const hoveredElement = this.expandables.toArray()[idx];
    hoveredElement.elemRef.nativeElement.style.transform = 'scale(1) translateZ(0)';
  }

  /**
   * Whether or not the page is active.
   * @param dotIndex
   */
  isDotActive(dotIndex: number) {
    return Math.floor(this.carouselOffset / this.options.numVisibleItems) === -dotIndex;
  }

  /**
   * To be used to navigate from one page to another.
   * @param dotIndex
   */
  onNavigationDotClick(dotIndex: number) {
    this.difference = 0;
    this.carouselOffset = -dotIndex * this.options.numVisibleItems;
    const itemsLeft = this.getRemainingItems();
    if (itemsLeft < 0) {
      this.difference = -itemsLeft;
      this.carouselOffset -= itemsLeft;
      this.updateStyles();
    }
    if (this.difference === 0) {
      this.setExpandableLayerStyles();
      this.setBodyLayerStyles();
    }
  }

  /**
   * To be used to update the styles on the slides.
   */
  updateStyles() {
    const offset = -this.carouselOffset;
    const limit = offset + this.options.numVisibleItems - 1;
    const expandables = this.expandables.toArray();
    const bodies = this.bodies.toArray();
    let hoveredElement = expandables[offset];
    hoveredElement.elemRef.nativeElement.style.transformOrigin = 'left';
    bodies[offset].elemRef.nativeElement.style.left = 0;

    for (let i = offset + 1; i <= limit - 1; i++) {
      hoveredElement = expandables[i];
      hoveredElement.elemRef.nativeElement.style.transformOrigin = '';
      bodies[i].elemRef.nativeElement.style.left = `${-(this.options.scaleFactor - 1) / 2 * 100}%`;
    }

    hoveredElement = expandables[limit];
    hoveredElement.elemRef.nativeElement.style.transformOrigin = 'right';
    bodies[limit].elemRef.nativeElement.style.left = 'inherit';
  }

  /**
   * To be used to set the spacing between items.
   */
  getMargins() {
    return `${this.options.itemSpacing / 2}`;
  }

  /**
   * Whether or not the index of item is equal to the hovered item index.
   * @param index
   */
  isItemHovered(index: number) {
    return this.hoveredIdx === index;
  }

  /**
   * To be used to get the number of items that are not visible.
   */
  private getRemainingItems() {
    return this.items.length - this.options.numVisibleItems + this.carouselOffset;
  }

}
