/**
 * Created by egonzalez<edgard.gonzalez@aurea.com> on 02/02/2017.
 */
import {
  Component,
  ContentChildren,
  ElementRef,
  Input,
  ViewChild,
  ViewEncapsulation,
  TemplateRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { IsSidebarItem } from './sidebar-item';
import { IsSidebarItemNodes } from './sidebar-item-nodes';
import { mobileOverlayFadeInOut } from './sidebar-animations';
import { IsTopbar } from '../topbar/topbar';

@Component({
  selector: 'is-sidebar,[is-sidebar]',
  templateUrl: 'sidebar.html',
  styleUrls: ['sidebar.scss'],
  animations: [mobileOverlayFadeInOut],
  encapsulation: ViewEncapsulation.None
})
export class IsSidebar implements OnInit, OnDestroy {

  /**
   * Whether or not expandable sidebar button is disabled
   */
  private _disableButton = false;

  /**
   * Whether or not scrollbars are available
   * meaning the legacy sidebar has overflow auto or not
   */
  private _scrollBars = false;

  /**
   * Defines if the sidebar is collapsed or not
   * used on the legacy implementation
   */
  public isOpen = false;

  /**
   * A list of IsSidebarItemNodes that is used
   * to auto generated a sidebar
   */
  @Input()
  autoGenerateItems: IsSidebarItemNodes = null;

  /**
   * Set whether sidebar is open
   */
  @Input()
  set open(value) {
    this.isOpen = coerceBooleanProperty(value);
  }

  /**
   * Whether or not expandable sidebar button is disabled
   */
  @Input()
  get disableButton() {
    return this._disableButton;
  }
  set disableButton(value) {
    this._disableButton = coerceBooleanProperty(value);
  }

  /**
   * Whether or not scrollbars are available
   * meaning the legacy sidebar has overflow auto or not
   */
  @Input()
  get scrollBars() {
    return this._scrollBars;
  }
  set scrollBars(value) {
    this._scrollBars = coerceBooleanProperty(value);
  }

  /**
   * Template input for sidebar item aux
   */
  @Input()
  auxTemplate: TemplateRef<any> = null;

  /**
   * The associated topbar to this sidebar. It's useful to get the events
   * from the hamburguer button.
   * @memberof IsSidebar
   */
  @Input()
  topbar: IsTopbar;

  /**
   * Array of IsSidebarItem children
   */
  @ContentChildren(IsSidebarItem)
  links: IsSidebarItem[];

  /**
   * Represents the subscription to the click of the hamburguer button click
   * @memberof IsSidebar
   */
  hamburguerSubscription: Subscription;

  /**
   * Reference to nav element
   */
  @ViewChild('navBar')
  navBar: ElementRef;

  /**
   * Indicates whether or not the mobile sidebar is shown
   * @memberof IsSidebar
   */
  mobileSidebarRevealed = false;

  ngOnInit() {
    // if the sidebar has an associated topbar, then subscribe to the hamburguer event
    if (this.topbar) {
      this.hamburguerSubscription = this.topbar.hamburgerClick
        .subscribe(this.handleHamburgerClick.bind(this));
    }
  }

  /**
   * Decides whether or not the mobile sidebar should open according to clicks on the
   * hamburger button. This method will be called each time there's a click on the
   * hamburguer button.
   * @memberof IsSidebar
   */
  handleHamburgerClick() {
    if (this.mobileSidebarRevealed) {
      this.hideMobileSidebar();
    } else {
      this.revealMobileSidebar();
    }
  }

  /**
   * Reveals the mobile sidebar (slide in from the left, fade in the background overlay)
   * @memberof IsSidebar
   */
  revealMobileSidebar() {
    this.mobileSidebarRevealed = true;
  }

  /**
   * Hides the mobile sidebar (slide out to the right, fade out the background overlay)
   * @memberof IsSidebar
   */
  hideMobileSidebar() {
    this.mobileSidebarRevealed = false;
  }

  /**
   * Toogles open state of the sidebar
   */
  toogleOpen() {
    this.isOpen = !this.isOpen;
  }

  /**
   * Scroll to any item by url
   * @param url
   */
  scrollTo(url: string) {
    const sidebarItem = this.getSidebarItemByUrl(url);
    if (sidebarItem) {
      const top = sidebarItem.elemRef.nativeElement.offsetTop;
      this.moveScrollTo(top);
    }
  }

  /**
   * Move nav container scroll to any given position
   * @param top
   */
  moveScrollTo(top: number) {
    this.navBar.nativeElement.scrollTop = top;
  }

  /**
   * Get a IsSidebarItem by a given url
   * @param url
   */
  getSidebarItemByUrl(url: string) {
    return this.links.find((sidebarItem) => {
      return sidebarItem.routerLink === url;
    });
  }

  /**
   * Unsubscribe the subscription on destroy life cycle.
   */
  ngOnDestroy() {
    if (this.hamburguerSubscription) {
      this.hamburguerSubscription.unsubscribe();
    }
  }
}
