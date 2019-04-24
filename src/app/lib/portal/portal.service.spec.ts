import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  OnInit,
  Input,
  TemplateRef
} from '@angular/core';
import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BreakpointObserver } from '@angular/cdk/layout';

import {
  MockDesktopBreakpointObserver
} from '../core';
import { IsPortalRef } from './portal-ref';
import { IsPortalModule } from './portal.module';
import { IsPortalService } from './portal.service';
import { IsPortalOptions } from './portal-options';
import { IsActivePortal } from './active-portal';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const basicTemplateHTML = `
<ng-template #basicTemplate
             let-close="close">
  <div class="p-3">
    <h3>Basic usage</h3>
    <p>Here comes any HTML!</p>
    <div class="d-flex justify-content-center">
      <button is-button
              theme="danger"
              class="close-btn"
              (click)="close('Click on Close')">
        <span>Close</span>
      </button>
    </div>
  </div>
</ng-template>
`;

describe('IsPortalService', () => {
  let service: IsPortalService;
  let fixture: ComponentFixture<any>;
  let component: MyTemplate;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IsPortalModule.forRoot(),
        NoopAnimationsModule
      ],
      declarations: [
        PortalExampleComponent,
        MyTemplate
      ],
      providers: [
        {provide: BreakpointObserver, useClass: MockDesktopBreakpointObserver}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ PortalExampleComponent ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTemplate);
    component = fixture.debugElement.componentInstance;
    service = getTestBed().get(IsPortalService);
  });

  describe('open()', () => {

    afterEach(() => {
      const portals = document.body.querySelectorAll('is-portal');
      for (let i = 0; i < portals.length; i++ ) {
        document.body.removeChild(portals[i]);
      }
      service.close();
    });

    it('should open the component', () => {
      service.open(PortalExampleComponent);

      const componentHTML = document.body.querySelector('app-portal-example');
      expect(componentHTML).not.toBe(null);
      expect(document.body.querySelector('is-portal')).not.toBeNull();
    });

    it('should attach portal to DOM', () => {
      expect(service['contentPortal']).toBeUndefined();
      expect(service['bodyPortalHost']).toBeUndefined();

      service.open(PortalExampleComponent);

      expect(service['contentPortal'].isAttached).toBeTruthy();
      expect(service['bodyPortalHost'].hasAttached()).toBeTruthy();
    });

    it('should set portal options', () => {
      const testData = 'Test data';
      const portalOptions = new IsPortalOptions();
      portalOptions.data = testData;
      service.open(PortalExampleComponent, portalOptions);
      fixture.detectChanges();
      expect(service['portalInstance'].mappedOptions.data).toEqual(testData);
    });

    it('should set portal mobile options', () => {
      const testData = 'Test data';
      const portalOptions = new IsPortalOptions();
      portalOptions.data = testData;
      service.open(PortalExampleComponent, null, portalOptions);
      fixture.detectChanges();
      expect(service['portalInstance'].mobileOptions.data).toEqual(testData);
    });

    it('should set portal destroy function', () => {
      service.open(PortalExampleComponent);
      const detachSpy = spyOn(service['contentPortal'], 'detach');
      expect(service['portalInstance']['_destroyFn']).toBeDefined();

      service['portalInstance']['_destroyFn']();
      expect(detachSpy).toHaveBeenCalled();
    });

    it('should create portal with template if content is template', () => {
      service.open(component.basicTemplate);

      const templateHTML = document.body.querySelector('div.p-3');
      expect(templateHTML).not.toBe(null);
    });

    it('should create portal with component if content is component', () => {
      service.open(PortalExampleComponent);

      const componentHTML = document.body.querySelector('app-portal-example');
      expect(componentHTML).not.toBe(null);
    });

    it('should return reference to IsPortalRef to access Portal instance ' +
      'and onClose event source', () => {
      const portalRef = service.open(PortalExampleComponent);
      expect(portalRef instanceof IsPortalRef).toBeTruthy();
    });
  });

  describe('close()', () => {
    it('should call closePortal api from portal instance, if instance exists', () => {
      service.open(PortalExampleComponent);
      const closePortalSpy = spyOn(service['portalInstance'], 'closePortal').and.callThrough();

      service.close();
      expect(closePortalSpy).toHaveBeenCalled();
    });
  });
});

@Component({
  selector: 'my-template',
  template: `${basicTemplateHTML}`,
})
export class MyTemplate {
  @ViewChild('basicTemplate')
  basicTemplate: TemplateRef<any>;
}

@Component({
  selector: 'app-portal-example',
  template: `
  <div class="p-3">
    <h3>{{title}}</h3>
    <p>This is the example component content!</p>
    <p><b>Incoming data: {{data|json}}</b></p>
    <button is-button theme="danger" (click)="close()">Close</button>
  </div>
  `
})
export class PortalExampleComponent  implements OnInit {
  @Input()
  title: string;

  data: any;

  constructor ( private activePortal: IsActivePortal ) {}

  ngOnInit() {
    this.data = this.activePortal.data;
  }

  close() {
    this.activePortal.close();
  }
}
