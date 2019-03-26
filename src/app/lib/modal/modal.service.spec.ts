import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { basicTemplateHTML } from '../../app/module/components/pages/modal/api-ref';
import { ModalExampleComponent } from '../../app/module/components/pages/modal/modal-example.component';
import { IsModalRef } from './modal-ref';
import { IsModalModule } from './modal.module';
import { IsModalService } from './modal.service';

describe('IsModalService', () => {
  let service: IsModalService;
  let fixture: ComponentFixture<any>;
  let component: MyTemplate;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IsModalModule.forRoot()
      ],
      declarations: [
        ModalExampleComponent,
        MyTemplate
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ ModalExampleComponent ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTemplate);
    component = fixture.debugElement.componentInstance;
    service = getTestBed().get(IsModalService);
  });

  describe('open()', () => {
    it('should attach modal to DOM', () => {
      expect(service['contentPortal']).toBeUndefined();
      expect(service['bodyPortalHost']).toBeUndefined();

      service.open(ModalExampleComponent);

      expect(service['contentPortal'].isAttached).toBeTruthy();
      expect(service['bodyPortalHost'].hasAttached()).toBeTruthy();
    });

    it('should set modal options', () => {
      const testData = 'Test data';
      service.open(ModalExampleComponent, {
        data: testData
      });

      expect(service['modalInstance'].modalOptions.data).toEqual(testData);
    });

    it('should set modal detroy function', () => {
      service.open(ModalExampleComponent);
      const detachSpy = spyOn(service['contentPortal'], 'detach');
      expect(service['modalInstance']['_destroyFn']).toBeDefined();

      service['modalInstance']['_destroyFn']();
      expect(detachSpy).toHaveBeenCalled();
    });

    it('should create modal with template if content is template and set ' +
      'the context using active modal', () => {
      const testData = 'Test data';
      service.open(component.basicTemplate, {
        data: testData
      });

      const templateHTML = document.body.querySelector('div.p-3');
      expect(templateHTML).not.toBe(null);
    });

    it('should create modal with component if content is ' +
      'component and inject active modal in entry component', () => {
      const testData = 'Test data';
      const modalRef = service.open(ModalExampleComponent, {
        data: testData
      });

      const componentHTML = document.body.querySelector('app-modal-example');
      expect(componentHTML).not.toBe(null);
      expect(modalRef.instance.activeModal.data).toEqual(testData);
    });

    it('should return reference to IsModalRef to access Modal instance ' +
      'and onClose event source', () => {
      const testData = 'Test data';
      const modalRef = service.open(ModalExampleComponent, {
        data: testData
      });
      expect(modalRef instanceof IsModalRef).toBeTruthy();
    });
  });
});

@Component({
  selector: 'my-template',
  template: `${basicTemplateHTML}`,
})
export class MyTemplate {
  @ViewChild('basicTemplate') basicTemplate;
}
