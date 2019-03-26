import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  IsSidebarModule,
  IsSidebar,
  IsSidebarLink,
  IsSidebarItemNodes
} from './index';

let fixture: any;

let el: any;

let component: any;

let isSidebarComponent: any;

const mockedLinks: IsSidebarItemNodes[] = [
  {
    link: '/components/table',
    label: 'Table',
    icon: 'fa-table',
    auxInfo: {
      class: 'warning',
      info: 15
    },
    nodes: [
      {
        link: '/components/sidebar',
        icon: 'fa-columns',
        label: 'Sidebar',
      },
      {
        label: 'Tools',
        icon: 'fa-cogs',
        expanded: true,
      }
    ]
  },
  {
    link: '/components/topbar',
    icon: 'fa-bars',
    label: 'TopBar'
  }
];

describe('IsSidebar', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IsSidebarModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule
      ],
      declarations: [
        BasicController,
        NestedController,
        AuxController
      ],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  function setValues(controller) {
    fixture = TestBed.createComponent(controller);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const sidebarElFixture = fixture.debugElement
      .query(By.directive(IsSidebar));
    isSidebarComponent = sidebarElFixture.componentInstance;
    el = sidebarElFixture.nativeElement;
  }

  describe('Basic Sidebar', () => {
    beforeEach(() => {
      setValues(BasicController);
    });

    it('should create the basic select component with options', () => {
      expect(el).not.toBe(null);
    });

    it('should open the sidebar', () => {
      component.isOpenSideBar = true;
      fixture.detectChanges();
      const items = el.querySelectorAll('.is-sidebar-item');
      expect(items.length).toBe(3);
      expect(isSidebarComponent.isOpen).toBe(true);
    });

    it('should toggle the sidebar on clicking the sidebar button', () => {
      const button = el.querySelector('.is-sidebar__slide-button');
      button.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(isSidebarComponent.isOpen).toBe(true);
    });

    // Should be consider again, as this function is not getting called anywhere
    // so forcefully testing it here.
    it('should scroll to the specific item by url', () => {
      spyOn(isSidebarComponent, 'moveScrollTo').and.callThrough();
      spyOn(isSidebarComponent, 'getSidebarItemByUrl').and.callThrough();
      const sidebar = el.querySelector('.is-sidebar');
      sidebar.style.height = '100px';
      sidebar.style.overflow = 'auto';
      const url = '/components/sidebar';
      isSidebarComponent.scrollTo(url);
      fixture.detectChanges();
      expect(isSidebarComponent.getSidebarItemByUrl).toHaveBeenCalled();
      expect(isSidebarComponent.moveScrollTo).toHaveBeenCalled();
      expect(isSidebarComponent.navBar.nativeElement.scrollTop).not.toBe(0);
    });

    it('should destroy the component', () => {
      component.isOpenSideBar = true;
      fixture.detectChanges();
      const items = el.querySelectorAll('.is-sidebar-item');
      items[0].dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(component.showSideBar).toBe(false);
    });
  });

  describe('Nested Sidebar', () => {
    beforeEach(() => {
      setValues(NestedController);
    });

    it('should create nested sidebar', () => {
      expect(el).not.toBe(null);
      const items = el.querySelectorAll('.is-sidebar__item__menu');
      expect(items.length).toBe(2);
    });

    it('should expand the nested item', () => {
      const item = el.querySelectorAll('.is-sidebar__item-container')[0];
      item.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      const activeItem = el.querySelectorAll('.is-sidebar__item__menu');
      expect(activeItem[0].classList.contains('is-sidebar__item__menu--active')).toBe(true);
      expect(activeItem[1].classList.contains('is-sidebar__item__menu--active')).toBe(false);
    });

    it('should set the item as activeby default in the nested items list',
      () => {
        component.isActive = true;
        fixture.detectChanges();
        const activeItem = el.querySelectorAll('.is-sidebar__item__menu');
        const nestedActiveItem = activeItem[0].querySelectorAll('.is-sidebar__item-container')[0];
        expect(nestedActiveItem.classList.contains('is-sidebar__item--active')).toBe(true);
      });
  });

  describe('Aux Sidebar', () => {
    beforeEach(() => {
      setValues(AuxController);
    });

    it('should create nested sidebar with aux template', () => {
      expect(el).not.toBe(null);
      expect(isSidebarComponent.auxTemplate).not.toBe(null);
      expect(isSidebarComponent.autoGenerateItems.length).toBe(2);
    });
  });
});

@Component({
  template: `
  <div class="demo">
    <nav is-sidebar
         #isSidebar
         [open]="isOpenSideBar"
         *ngIf="showSideBar">
      <a *ngFor="let navLink of links"
         is-sidebar-item
         [routerLink]="navLink.link"
         routerLinkActive="active"
         #rla="routerLinkActive"
         [isActive]="rla.isActive"
         (click)="hideSideBar()"
         [isOpen]="isSidebar.isOpen">
        <span class="is-sidebar__item-icon--active">
          <i class="fa icon-active"
             [ngClass]="navLink.icon"></i>
        </span>
        <span class="is-sidebar__item-icon--inactive">
          <i class="fa icon-inactive"
             [ngClass]="navLink.icon"></i>
        </span>
        <span class="sidebar-item-text">
          {{navLink.label}}
        </span>
      </a>
    </nav>
  </div>`
})

class BasicController {
  isOpenSideBar = false;
  showSideBar = true;
  links: IsSidebarLink[] = [
    { link: '/components/card', label: 'Card', icon: 'fa-address-card' },
    { link: '/components/snackbar', label: 'Snackbar', icon: 'fa-comment' },
    { link: '/components/sidebar', label: 'Sidebar', icon: 'fa-bars' }
  ];

  hideSideBar() {
    this.showSideBar = false;
  }
}

@Component({
  template: `
  <is-sidebar [disableButton]="true"
              [open]="true">
    <is-sidebar-item
      [hasIcon]="false"
      [hasNestedMenu]="true">
      <a>
        Library
      </a>
      <is-sidebar-item [hasIcon]="false"
                       link="/components/bar-chart"
                       [isActive] ="isActive">
        <a routerLink="/components/bar-chart"
           routerLinkActive="active"
           [routerLinkActiveOptions]="{exact: true}">
          Bar Chart
        </a>
      </is-sidebar-item>
    </is-sidebar-item>
    <is-sidebar-item [hasIcon]="false"
                     [hasNestedMenu]="true"
                     link="/components/login">
      <a routerLink="/components/login"
         routerLinkActive="active"
         [routerLinkActiveOptions]="{exact: true}">
        <i class="fa fa-sign-out"></i>
        Login
      </a>
    </is-sidebar-item>
  </is-sidebar>`
})

class NestedController {
  isActive = false;
}

@Component({
  template: `
  <is-sidebar [autoGenerateItems]="autoGenerateLinks"
              [disableButton]="true"
              [auxTemplate]="auxTemplate"
              [open]="true"></is-sidebar>

  <ng-template #auxTemplate
               let-data="data"
               let-item="item">
    <span class="badge badge-{{data.class}}"
          [ngbTooltip]="item.label"
          container="body">{{data.info}}
    </span>
  </ng-template>`
})

class AuxController {
  autoGenerateLinks = mockedLinks;
}
