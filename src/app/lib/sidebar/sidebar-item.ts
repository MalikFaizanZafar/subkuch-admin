/**
 * Created by egonzalez<edgard.gonzalez@aurea.com> on 02/02/2017.
 */
import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { IsSidebarItemNodes } from './sidebar-item-nodes';
import {
  expandCollapseSideBarMenu,
  nestedExpandCollapseSideBarMenu
} from './sidebar-item-animations';

@Component({
  selector: 'is-sidebar-item,[is-sidebar-item]',
  templateUrl: 'sidebar-item.html',
  styleUrls: ['sidebar-item.scss'],
  animations: [expandCollapseSideBarMenu, nestedExpandCollapseSideBarMenu],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'is-sidebar-item'
  }
})
export class IsSidebarItem implements OnInit, OnDestroy, AfterViewInit {

  /**
   * Indicates whether or not this item should be expanded by default.
   */
  private _expanded: boolean;

  /**
   * Whether the link is active.
   */
  private _isActive = false;

  /**
   * Whether the sidebar is open.
   * used for legacy implementation
   */
  private _isOpen = false;

  /**
   * Whether the link was provided with icon settings.
   * for legacy purposes
   */
  private _hasIcon = true;

  /**
   * Whether the sidebar-item has a nested menu.
   */
  private _hasNestedMenu = false;

  /**
   * Whether the sidebar-item is openned.
   */
  private _isNestedMenuOpen = false;

  /**
   * Variable that holds the animation state
   * for nested menu collapse animation
   */
  public collapseExpand: string;

  /**
   * Holds the value of the Current level in the sidebar tree big O(N)
   */
  level = 0;

  /**
   * Selector for IsSidebarItems inside ng-content
   * on the template, for manually coded sidebar-items
   */
  @ContentChildren(IsSidebarItem)
  innerContentMenu: QueryList<IsSidebarItem>;

  /**
   * Selector for IsSidebarItems that are auto
   * generated.
   */
  @ViewChildren(IsSidebarItem)
  innerViewMenu: QueryList<IsSidebarItem>;

  /**
   * An Array of IsSidebarItem that holds
   * the merge of innerContentMenu and innerViewMenu
   * meant to centralise all the childs IsSidebarItem
   * for easier manipulation
   */
  menu: IsSidebarItem[];

  /**
   * The sidebar-item link, its used
   * to determine internaly if this particular
   * item is active or not.
   */
  @Input()
  link: string;

  /**
   * The sidebar-item label, its used
   * to expose it in the aux template context.
   */
  @Input()
  label: string;

  /**
   * Indicates whether or not this item should be expanded by default.
   */
  @Input()
  get expanded() {
    return this._expanded;
  }
  set expanded(value) {
    this._expanded = coerceBooleanProperty(value);
  }

  /**
   * FontAwesome for sidebar item
   */
  @Input()
  icon: string;

  /**
   * Whether the link is active.
   */
  @Input()
  get isActive() {
    return this._isActive;
  }
  set isActive(value) {
    this._isActive = coerceBooleanProperty(value);
  }

  /**
   * Whether the sidebar is open.
   * used for legacy implementation
   */
  @Input()
  get isOpen() {
    return this._isOpen;
  }
  set isOpen(value) {
    this._isOpen = coerceBooleanProperty(value);
  }

  /**
   * The sidebar-item link, its used
   * for legacy purposes
   */
  @Input()
  routerLink: string;

  /**
   * Whether the link was provided with icon settings.
   * for legacy purposes
   */
  @Input()
  get hasIcon() {
    return this._hasIcon;
  }
  set hasIcon(value) {
    this._hasIcon = coerceBooleanProperty(value);
  }

  /**
   * The shevron icon name when nested
   * sidebar is opened.
   */
  @Input()
  shevronIconOpened = 'fa-angle-down';

  /**
   * The shevron icon name when nested
   * sidebar is closed.
   */
  @Input()
  shevronIconClosed = 'fa-angle-right';

  /**
   * Whether the sidebar-item has a nested menu.
   */
  @Input()
  get hasNestedMenu() {
    return this._hasNestedMenu;
  }
  set hasNestedMenu(value) {
    this._hasNestedMenu = coerceBooleanProperty(value);
  }

  /**
   * Whether the sidebar-item is openned.
   */
  @Input()
  get isNestedMenuOpen() {
    return this._isNestedMenuOpen;
  }
  set isNestedMenuOpen(value) {
    this._isNestedMenuOpen = coerceBooleanProperty(value);
  }

  /**
   * A list of nodes, if the sidebar-item has a nested menu.
   * all its direct sidebar-item childs will be stored here.
   */
  @Input()
  nodes: IsSidebarItemNodes;

  /**
   * Template input for sidebar item aux
   */
  @Input()
  auxTemplate: TemplateRef<any> = null;

  /**
   * Template input for sidebar item aux
   */
  @Input()
  auxInfo: any;

  /**
   * Placeholder element for aux template
   * @memberof IsSidebarItem
   */
  @ViewChild('auxTemplateAnchor', { read: ViewContainerRef })
  auxPlaceholder: ViewContainerRef;

  /**
   * Helper Observable that when evoked
   * will destroy all subscriptions used in this
   * component.
   */
  destroy$: Subject<any> = new Subject();

  /**
   * Observable that emmits a change whenever
   * the sidebar-item detects its active state
   * changed
   */
  onActiveEmitter: Subject<any> = new Subject;

  /**
   * Constructor of the component
   * @param elemRef - reference to DOM element that represents this component.
   */
  constructor(
    public elemRef: ElementRef) { }

  /**
   * On init lifecycle that defines if the
   * component its active upon initialization
   * and register a subscription for router events
   * so its always up to date on that regard
   */
  ngOnInit() {
    if (this.auxTemplate && this.auxInfo) {
      const embeddedTemplate = this.auxPlaceholder
        .createEmbeddedView(this.auxTemplate);
      embeddedTemplate.context.data = this.auxInfo;
      embeddedTemplate.context.item = {
        icon: this.icon,
        label: this.label,
        link: this.link
      };
    }
  }

  /**
   * After init lifecycle that checks if the
   * nested childs are active or not,
   * and choose to toggle the nested sidebar panel.
   * Register listeners for sidebar-item childs
   * onActiveEmmiter changes.
   */
  ngAfterViewInit() {
    // merges both arrays for easier manipulation
    this.menu = [
      ...this.innerContentMenu.toArray(),
      ...this.innerViewMenu.toArray()
    ].filter(elem => elem !== this);

    // register listener to all direct childs, so its aware of changes
    this.menu.forEach(item => {
      item.level = this.level + 1;
    });
    // after every round of change detection, dev mode immediately
    // performs a second round to verify that no bindings have
    // changed since the end of the first.
    // Here we change binding but new round of change detection is not
    // triggered. In this case TimeOut is used to manually trigger change
    // detection. this is the accepted workaround for this well known bug.
    // Github Issue: https://github.com/angular/angular/issues/6005
    setTimeout(() => {
      this.isNestedMenuOpen = this.expanded || this.shouldExpand(this.menu);
      this.collapseExpand = this.isNestedMenuOpen ? 'expanded' : 'collapsed';
      this.checkNestedAnimation();
      this.onActiveEmitter.next();
    }, 1);
  }

  /**
   * checks for the kind of animation that should be applied
   * to the sidebar-item
   * Deep nested items, dont need overflow, only root elements
   */
  checkNestedAnimation() {
    if (this.level >= 1) {
      this.collapseExpand = this.isNestedMenuOpen ? 'nested-expanded' : 'nested-collapsed';
    } else {
      this.collapseExpand = this.isNestedMenuOpen ? 'expanded' : 'collapsed';
    }
  }

  /**
   * method that returns the shevron
   * icon given the nestedMenu opened/closed
   * state.
   */
  nestedMenuIcon(): string {
    return this.isNestedMenuOpen ? this.shevronIconOpened : this.shevronIconClosed;
  }

  /**
   * Toggles the nested menu
   */
  onItemClick() {
    this.isNestedMenuOpen = !this.isNestedMenuOpen;
    this.checkNestedAnimation();
  }

  /**
   * Method  that checks of all menu items
   * if there's a child active
   * the sidebar-item detects its active state
   * @param array
   */
  shouldExpand(array: IsSidebarItem[]): boolean {
    return array.some(item => {
      // increasing level value for childs
      item.level = this.level + 1;
      if (item.isActive || item.isNestedMenuOpen) {
        return true;
      }
      return false;
    });
  }

  /**
   * On destroy lifecycle
   * it emits destroy$ event, so all subscriptions
   * used in this component are finished.
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
