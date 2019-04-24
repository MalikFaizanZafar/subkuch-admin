import { async, discardPeriodicTasks, fakeAsync, getTestBed, TestBed, tick } from '@angular/core/testing';
import {
  ApplicationRef,
  ComponentFactoryResolver,
  CUSTOM_ELEMENTS_SCHEMA,
  Injector
} from '@angular/core';

import { IsToasterService } from './toast.service';
import { ToastOptions } from './toast-options';
import { IsToastContainer } from './toast-container';
import { IsToastPosition } from './toast-position';
import { Observable, of } from 'rxjs';
import { IsToast } from './toast';
import { IsToastAction } from './toast-action';

class MockIsToast extends IsToast {
  constructor() {
    super(null, null);
  }
}
const isToast: MockIsToast = new MockIsToast();
class MockIsToastContainer extends  IsToastContainer {
  constructor() {
    super();
  }

  addToastToContainer( message: string, options: ToastOptions ): Observable<MockIsToast> {
    return of(isToast);
  }
}

describe('Service: IsToasterService', () => {
  let service: IsToasterService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        ApplicationRef,
        ComponentFactoryResolver,
        Injector,
        IsToasterService
      ],
      declarations: [
        IsToastContainer
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    const testbed = getTestBed();
    service = testbed.get(IsToasterService);
  }));

  describe('constructor', () => {
    it('should initialize data', () => {
      expect(service.toastsArray).toBeDefined();
      expect(service.toastConstant).toBeDefined();
    });
  });

  describe('pop', () => {

    beforeEach(() => {
      service.setToastContainerInstance(new MockIsToastContainer());
      spyOn(service, 'pop').and.callThrough();
      spyOn(service, 'getOptions').and.callThrough();
    });

    it('should pop success toast', fakeAsync(() => {
      const observableResult = {
        action: IsToastAction.CloseButtonClick,
        instance: isToast
      };
      let data = {};
      service.popSuccess('Success Toast');
      expect(service.pop).toHaveBeenCalled();

      const options = new ToastOptions();
      service.popSuccess('Success Toast', options);
      expect(service.pop).toHaveBeenCalled();
      expect(service.getOptions).toHaveBeenCalled();

      options.title = 'Complete Success';
      options.faIcon = 'fa-check-circle';
      service.popSuccess('Success Toast', options)
        .subscribe((result) => {
          data = result;
        });
      isToast.onCloseButtonClick.emit();
      tick(10);
      expect(service.pop).toHaveBeenCalled();
      expect(service.getOptions).toHaveBeenCalled();
      expect(data).toEqual(observableResult);
      discardPeriodicTasks();
    }));

    it('should pop error toast', fakeAsync(() => {
      const observableResult = {
        action: IsToastAction.Click,
        instance: isToast
      };
      let data = {};
      service.popError('Error Toast');
      expect(service.pop).toHaveBeenCalled();

      const options = new ToastOptions();
      service.popError('Error Toast', options);
      expect(service.pop).toHaveBeenCalled();
      expect(service.getOptions).toHaveBeenCalled();

      options.title = 'New Error';
      options.faIcon = 'fa-bug';
      service.popError('Error Toast', options)
        .subscribe((result) => {
          data = result;
        });
      isToast.onClick.emit();
      tick(10);
      expect(service.pop).toHaveBeenCalled();
      expect(service.getOptions).toHaveBeenCalled();
      expect(data).toEqual(observableResult);
      discardPeriodicTasks();
    }));

    it('should pop warning toast', fakeAsync(() => {
      const observableResult = {
        action: IsToastAction.AutoClose,
        instance: isToast
      };
      let data = {};
      service.popWarning('Warning Toast');
      expect(service.pop).toHaveBeenCalled();

      const options = new ToastOptions();
      service.popWarning('Warning Toast', options);
      expect(service.pop).toHaveBeenCalled();
      expect(service.getOptions).toHaveBeenCalled();

      options.title = 'Warning but not error';
      options.faIcon = 'fa-exclamation-triangle';
      service.popWarning('Warning Toast', options)
        .subscribe((result) => {
          data = result;
        });
      isToast.closeTimeOut.emit();
      tick(10);
      expect(service.pop).toHaveBeenCalled();
      expect(service.getOptions).toHaveBeenCalled();
      expect(data).toEqual(observableResult);
      discardPeriodicTasks();
    }));

    it('should pop info toast', () => {
      service.popInfo('Info Toast');
      expect(service.pop).toHaveBeenCalled();

      const options = new ToastOptions();
      service.popInfo('Info Toast', options);
      expect(service.pop).toHaveBeenCalled();
      expect(service.getOptions).toHaveBeenCalled();

      options.title = 'Complete Information';
      options.faIcon = 'fa-exclamation-circle';
      service.popWarning('Info Toast', options);
      expect(service.pop).toHaveBeenCalled();
      expect(service.getOptions).toHaveBeenCalled();
    });

    it('should not mutate the options object', () => {
      const options: ToastOptions = {
        faIcon: 'xyz'
      };
      const optionsClone = { ...options };
      service.popError('text', options);
      expect(options).toEqual(optionsClone);
    });
  });

  describe('buildToastOptions', () => {
    it('should set options', () => {
      const mergedOptions = {
        closeOnClick: true,
        autoCloseTime: 5000,
        hasAutoCloseTime: true,
        showCloseButton: true,
        position: IsToastPosition.TopRight,
        newestFirst: true,
        faIcon: 'fa-check',
        width: '320px'
      };
      const options = {
        faIcon: 'fa-check'
      };
      const toastOptions = service.buildToastOptions(options);
      expect(toastOptions).toEqual(mergedOptions);
    });
  });

});
