import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IsToast } from './toast';
import { IsToastContainer } from './toast-container';
import { IsToastPosition } from './toast-position';

export class MockToast extends IsToast {
  constructor() {
    super(null, null);
  }
}

describe('IsToastContainer', () => {
  let component: IsToastContainer;
  let fixture: ComponentFixture<IsToastContainer>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule ],
      declarations: [ IsToast, IsToastContainer ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
      .compileComponents().then(() => {
      fixture = TestBed.createComponent(IsToastContainer);
      component = fixture.componentInstance;
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addToastToContainer', () => {

    it('should set toasts array and add container position', () => {
      const options = {
        autoCloseTime: 5000,
        position: IsToastPosition.TopLeft
      };
      component.addToastToContainer('Default', options);
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });
      expect(component.toasts.length).toEqual(1);
    });

    it('should set toasts array and add container position', () => {
      const options = {
        autoCloseTime: 5000,
        position: IsToastPosition.TopLeft,
        newestFirst: true
      };
      component.addToastToContainer('Default', options);
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });
      expect(component.toasts.length).toEqual(1);
    });
  });

  describe('removeToast', () => {

    it('should remove toast from array if available in array', () => {
      const options = {
        autoCloseTime: 5000,
        position: IsToastPosition.TopLeft
      };
      const toast = {message: 'Default popup', options: options};
      component.toasts.push(toast);

      component.removeToast(toast);
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });
      expect(component.toasts.length).toEqual(0);
    });

    it('should not remove toast from array if not available in array', () => {
      const options = {
        autoCloseTime: 5000,
        position: IsToastPosition.TopLeft
      };
      const toast = {message: 'Default popup', options: options};
      component.toasts.push(toast);

      const anotherToast = {message: 'popup', options: options};
      component.removeToast(anotherToast);
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });
      expect(component.toasts.length).toEqual(1);
    });
  });

  describe('onToastClick', () => {
    it('should do the required action on click of isToast', () => {
      const mockToastObj = new MockToast();
      mockToastObj.options = {
        closeOnClick: true,
        showCloseButton: false
      };
      spyOn(component, 'removeToast').and.callThrough();
      component.onToastClick(mockToastObj);
      expect(component.removeToast).toHaveBeenCalled();
    });
  });
});
