import { async, ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ElementRef, Renderer2 } from '@angular/core';

import { IsToast } from './toast';
import { ToastOptions } from './toast-options';
import { TOAST_CONFIG } from './toast-config';

class MockElementRef extends ElementRef {
  constructor() {
    super(null);
  }
}

describe('IsToast', () => {
  let component: IsToast;
  let fixture: ComponentFixture<IsToast>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsToast ],
      providers: [
        {provide: ElementRef, useClass: MockElementRef},
        {provide: TOAST_CONFIG, useValue: {}},
        Renderer2
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
      .compileComponents().then(() => {
      fixture = TestBed.createComponent(IsToast);
      component = fixture.componentInstance;
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {

    it('should call closeTimeout.emit on ngOnInit', fakeAsync(() => {
      spyOn(component.closeTimeOut, 'emit').and.callThrough();
      component.options = new ToastOptions();
      fixture.detectChanges();
      component.ngOnInit();
      const toastElement = <HTMLElement> document.body.querySelector('.closable');
      expect(toastElement.style.width).toEqual('320px');
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });
      tick(5000);
      expect(component.closeTimeOut.emit).toHaveBeenCalled();
      discardPeriodicTasks();
    }));
  });

  describe('closeButtonClick', () => {
    it('should call onCloseButtonClick.emit', () => {
      spyOn(component.onCloseButtonClick, 'emit').and.callThrough();
      component.closeButtonClick();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });
      expect(component.onCloseButtonClick.emit).toHaveBeenCalledTimes(1);
    });

    it('should clear timer if hasAutoCloseTime is true', () => {
      component.options.hasAutoCloseTime = true;

      expect(component['timer']).not.toBeNull();
      component.closeButtonClick();
      expect(component['timer']).toBeNull();
    });

    it('should not clear timer if hasAutoCloseTime is false', () => {
      component.options.hasAutoCloseTime = false;

      expect(component['timer']).not.toBeNull();
      component.closeButtonClick();
      expect(component['timer']).not.toBeNull();

    });
  });

  describe('onFocus', () => {

    it('should call onFocus and call clear timeout', () => {
      spyOn(component, 'clearTimeout').and.callThrough();
      component.onFocus();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });
      expect(component.clearTimeout).toHaveBeenCalled();
    });
  });

  describe('onBlur', () => {

    it('should call onBlur and call clear timeout', () => {
      spyOn(component, 'setTimeout').and.callThrough();
      component.onBlur();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });
      expect(component.setTimeout).toHaveBeenCalled();
    });

    it('should set timer if hasAutoCloseTime is true', () => {
      component.options.hasAutoCloseTime = true;

      expect(component['timer']).toBeUndefined();
      component.onBlur();
      expect(component['timer']).not.toBeUndefined();
    });

    it('should not set timer if hasAutoCloseTime is false', () => {
      component.options.hasAutoCloseTime = false;

      expect(component['timer']).toBeUndefined();
      component.onBlur();
      expect(component['timer']).toBeUndefined();
    });
  });

  describe('onComponentClick', () => {

    it('should call onClick and call clear timeout', () => {
      const toastOptions = {
        closeOnClick: true
      };
      component.options = toastOptions;
      spyOn(component, 'clearTimeout').and.callThrough();
      spyOn(component.onClick, 'emit').and.callThrough();
      component.onComponentClick();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });
      expect(component.onClick.emit).toHaveBeenCalledTimes(1);
      expect(component.clearTimeout).toHaveBeenCalled();
    });

    it('should call onClick', () => {
      const toastOptions = {
        closeOnClick: false
      };
      component.options = toastOptions;
      spyOn(component, 'clearTimeout').and.callThrough();
      spyOn(component.onClick, 'emit').and.callThrough();
      component.onComponentClick();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });
      expect(component.onClick.emit).toHaveBeenCalledTimes(1);
      expect(component.clearTimeout).not.toHaveBeenCalled();
    });
  });
});
