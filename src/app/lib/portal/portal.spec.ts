import { Component, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { BreakpointObserver } from '@angular/cdk/layout';

import {
  IsResizeModule,
  MockDesktopBreakpointObserver
} from '../core';
import { IsPortalModule } from './portal.module';
import { IsPortalOptions } from './portal-options';
import { IsPortalOrientation } from './portal-orientation';
import { IsPortalService } from './portal.service';
import { IsPortal } from './portal';
import { IsPortalRef } from './portal-ref';

const portalOptions = new IsPortalOptions();

const basicTemplateHTML = `
<ng-template #basicTemplate>
  <div class="p-3">
    <h3>Basic usage</h3>
    <p>Here comes any HTML!</p>
    <div class="d-flex justify-content-center">
      <button is-button
              theme="danger"
              (click)="close()">
        <span>Close</span>
      </button>
    </div>
  </div>
</ng-template>
`;

let fixture: ComponentFixture<any>;
let testComponent: any;
let testComponentHTML: HTMLElement;
let openBtn: HTMLButtonElement;

function setValues( controller: any ) {
  fixture = TestBed.createComponent(controller);
  testComponent = fixture.componentInstance;
  testComponentHTML = fixture.nativeElement;
  openBtn = <HTMLButtonElement> testComponentHTML.querySelector('button.open-btn');
}

describe('IsPortal', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IsPortalModule.forRoot(),
        BrowserAnimationsModule,
        IsResizeModule
      ],
      declarations: [
        BasicPortalComponent,
        BasicInlinePortalComponent
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        IsPortalService,
        {provide: BreakpointObserver, useClass: MockDesktopBreakpointObserver}
      ]
    }).compileComponents();
  }));

  describe('BasicPortalComponent', () => {
    beforeEach(() => {
      setValues(BasicPortalComponent);
    });

    afterEach(() => {
      const portals = document.body.querySelectorAll('is-portal');
      for (let i = 0; i < portals.length; i++ ) {
        document.body.removeChild(portals[i]);
      }
    });

    it('should render backdrop for default Portal options', () => {
      openBtn.dispatchEvent(new Event('click'));
      const backdrop = document.body.querySelector('.is-portal__backdrop');
      expect(backdrop).not.toBe(null);
    });

    it('should not render backdrop if showBackdrop is false in Portal options', () => {
      portalOptions.showBackdrop = false;
      testComponent.portalOptions = portalOptions;

      openBtn.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      const backdrop = document.body.querySelector('.is-portal__backdrop');
      expect(backdrop).toBe(null);
    });

    it('should close Portal on click on backdrop if showBackdrop is true in Portal options', fakeAsync(() => {
      portalOptions.showBackdrop = true;
      testComponent.portalOptions = portalOptions;

      openBtn.dispatchEvent(new Event('click'));

      let closeReason: string;
      testComponent.portalRef.onClose.subscribe(() => {
        closeReason = 'closing';
      });
      const backdrop = document.body.querySelector('.is-portal__backdrop');
      backdrop.dispatchEvent(new Event('click'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(closeReason).toBe('closing');
      });
    }));

    it('should render content', () => {
      openBtn.dispatchEvent(new Event('click'));
      const content = document.body.querySelector('.is-portal__content');
      expect(content).not.toBe(null);
    });

    it('should render template', () => {
      openBtn.dispatchEvent(new Event('click'));
      const template = document.body.querySelector('.is-portal__template');
      expect(template).not.toBe(null);
    });

    it('should close portal on esc key', fakeAsync(() => {
      openBtn.dispatchEvent(new Event('click'));

      let closeMessage: string;
      testComponent.portalRef.onClose.subscribe(() => {
        closeMessage = 'close';
      });
      const event = new KeyboardEvent('keydown', {
         'key': 'Escape'
      });
      window.dispatchEvent(event);
      fixture.detectChanges();
      tick(400);
      expect(closeMessage).toBe('close');
    }));

    it('should close portal on backdrop click', fakeAsync(() => {
      openBtn.dispatchEvent(new Event('click'));
      let closeMessage: string;
      testComponent.portalRef.onClose.subscribe(() => {
        closeMessage = 'close';
      });
      const backdrop = document.body.querySelector('.is-portal__backdrop');
      backdrop.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      tick(400);
      expect(closeMessage).toBe('close');
    }));

    it('should not close portal on esc key if closeOnEscape is disabled', () => {
      let closeMessage: string;

      testComponent.portalOptions = portalOptions;
      testComponent.portalOptions.closeOnEsc = false;
      fixture.detectChanges();
      openBtn.dispatchEvent(new Event('click'));
      testComponent.portalRef.onClose.subscribe(() => {
        closeMessage = 'close';
      });
      const event = new KeyboardEvent('keydown', {
         'key': 'Escape'
      });
      window.dispatchEvent(event);
      fixture.detectChanges();
      expect(closeMessage).toBeUndefined();
    });


    it('should not close portal on backdrop click if closeOnBackdropClick is disabled', () => {
      testComponent.portalOptions = portalOptions;
      testComponent.portalOptions.closeOnBackdropClick = false;
      fixture.detectChanges();
      openBtn.dispatchEvent(new Event('click'));
      let closeMessage: string;
      testComponent.portalRef.onClose.subscribe(() => {
        closeMessage = 'close';
      });
      const backdrop = document.body.querySelector('.is-portal__backdrop');
      backdrop.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(closeMessage).toBeUndefined();
    });
  });

  describe('BasicInlinePortalComponent', () => {
    let componentElement: HTMLElement;
    beforeEach(() => {
      setValues(BasicInlinePortalComponent);
      const portalDebug = fixture.debugElement.query(
        By.directive(IsPortal)
      );

      componentElement = portalDebug.nativeElement;
    });

    it('should show template content inline when showPortal is false', () => {
      testComponent.showPortal = false;
      testComponent.showTemplate = true;
      testComponent.portalOptions = portalOptions;

      fixture.detectChanges();

      const backdrop = componentElement.querySelector('.is-portal__backdrop');
      expect(backdrop).toBeNull();

      expect(componentElement.classList).not.toContain('is-portal--full');

      const container = componentElement.querySelector('.is-portal__container--show');
      expect(container).toBeNull();

      const content = componentElement.querySelector('.content-inline');
      expect(content).not.toBeNull();
    });

   it('should show template content as overlay when showPortal is true', () => {
      testComponent.showTemplate = true;
      testComponent.portalOptions = portalOptions;
      testComponent.showPortal = true;
      fixture.detectChanges();

      const backdrop = componentElement.querySelector('.is-portal__backdrop');
      expect(backdrop).not.toBeNull();

      expect(componentElement.classList).toContain('is-portal--full');

      const container = componentElement.querySelector('.is-portal__container--show');
      expect(container).not.toBeNull();

      const content = componentElement.querySelector('.content-inline');
      expect(content).not.toBeNull();
    });

    it('should not show template content inline when showTemplate is false', () => {
      testComponent.showPortal = false;
      testComponent.showTemplate = false;
      fixture.detectChanges();

      const backdrop = componentElement.querySelector('.is-portal__backdrop');
      expect(backdrop).toBeNull();

      expect(componentElement.classList).not.toContain('is-portal--full');

      const container = componentElement.querySelector('.is-portal__container--show');
      expect(container).toBeNull();

      const content = componentElement.querySelector('.is-portal__container--hide');
      expect(content).not.toBeNull();
    });

    it('should add is-portal__container--bottom orientation class', () => {
      testComponent.showPortal = true;
      testComponent.showTemplate = false;
      testComponent.portalOptions = portalOptions;
      fixture.detectChanges();

      const container = componentElement.querySelector('.is-portal__container');
      expect(container.classList).toContain('is-portal__container--bottom');
    });

    it('should add is-portal__container--top orientation class', () => {
      testComponent.showPortal = true;
      testComponent.showTemplate = false;
      portalOptions.orientation = IsPortalOrientation.Top;
      testComponent.portalOptions = portalOptions;
      fixture.detectChanges();

      const container = componentElement.querySelector('.is-portal__container');
      expect(container.classList).toContain('is-portal__container--top');
    });

    it('should add is-portal__container--right orientation class', () => {
      testComponent.showPortal = true;
      testComponent.showTemplate = false;
      portalOptions.orientation = IsPortalOrientation.Right;
      testComponent.portalOptions = portalOptions;
      fixture.detectChanges();

      const container = componentElement.querySelector('.is-portal__container');
      expect(container.classList).toContain('is-portal__container--right');
    });

    it('should add is-portal__container--left orientation class', () => {
      testComponent.showPortal = true;
      testComponent.showTemplate = false;
      portalOptions.orientation = IsPortalOrientation.Left;
      testComponent.portalOptions = portalOptions;
      fixture.detectChanges();

      const container = componentElement.querySelector('.is-portal__container');
      expect(container.classList).toContain('is-portal__container--left');
    });

    it('should add height if orientation is top or bottom', () => {
      testComponent.showPortal = true;
      testComponent.showTemplate = false;
      portalOptions.height = 200;
      portalOptions.width = 500;
      portalOptions.orientation = IsPortalOrientation.Bottom;
      testComponent.portalOptions = portalOptions;
      fixture.detectChanges();

      const container = <HTMLElement> componentElement.querySelector('.is-portal__container');
      expect(container.classList).toContain('is-portal__container--bottom');
      expect(container.style.width).toEqual('');
      expect(container.style.height).toEqual('200px');
    });

    it('should add width if orientation is left or right', () => {
      testComponent.showPortal = true;
      testComponent.showTemplate = false;
      portalOptions.height = 200;
      portalOptions.width = 500;
      portalOptions.orientation = IsPortalOrientation.Left;
      testComponent.portalOptions = portalOptions;
      fixture.detectChanges();

      const container = <HTMLElement> componentElement.querySelector('.is-portal__container');
      expect(container.classList).toContain('is-portal__container--left');
      expect(container.style.width).toEqual('500px');
      expect(container.style.height).toEqual('');
    });
  });
});

@Component({
  template: `
  <input type="text" />
  <button type="button"
          class="open-btn"
          (click)="openTemplatePortal(basicTemplate)">
    Open Portal
  </button>
  ${basicTemplateHTML}
  `
})
class BasicPortalComponent {
  portalRef: IsPortalRef;
  portalOptions: IsPortalOptions;

  constructor( public portalService: IsPortalService ) {}

  openTemplatePortal( template: TemplateRef<any> ): void {
    this.portalRef = this.portalService.open(template, this.portalOptions);
  }
}

@Component({
  template: `
  <is-portal [showTemplateContentAlways]="showTemplate"
             [options]="portalOptions"
             [showPortal]="showPortal"
             (close)="closePortal()">
    <div class="content-inline">I am inline portal</div>
  </is-portal>
  `
})
class BasicInlinePortalComponent {
  portalOptions: IsPortalOptions;
  showPortal: boolean;
  showTemplate: boolean;

  closePortal() {
    this.showPortal = false;
  }
}
