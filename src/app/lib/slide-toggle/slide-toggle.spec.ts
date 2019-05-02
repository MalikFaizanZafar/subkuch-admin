import { Component } from '@angular/core';
import { By, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { PlatformModule } from '@angular/cdk/platform';
import {
  NgModel,
  FormsModule,
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';

import { IsSlideToggle } from './slide-toggle';
import { IsSlideToggleModule } from './slide-toggle.module';
import { IsSlideToggleChange } from './slide-toggle.models';
import { TestGestureConfig } from '../core/index';

const mockEvent = new Event('slide');
mockEvent['deltaX'] = 0;

describe('IsSlideToggle', () => {

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule,
          ReactiveFormsModule,
          PlatformModule,
          IsSlideToggleModule.forRoot()
        ],
        declarations: [
          SlideToggleTestApp,
          SlideToggleWithFormControl
        ],
        providers: [
          {provide: HAMMER_GESTURE_CONFIG, useClass: TestGestureConfig}
        ]
      });

      TestBed.compileComponents();
    })
  );

  describe('basic behavior', () => {
    let fixture: ComponentFixture<any>;

    let testComponent: SlideToggleTestApp;
    let slideToggle: IsSlideToggle;
    let slideToggleElement: HTMLElement;
    let slideToggleModel: NgModel;
    let labelElement: HTMLLabelElement;
    let inputElement: HTMLInputElement;
    let barElement: HTMLInputElement;

    // This initialization is async() because it needs to wait for ngModel to set the initial value.
    beforeEach(
      async(() => {
        fixture = TestBed.createComponent(SlideToggleTestApp);

        testComponent = fixture.debugElement.componentInstance;

        // Enable jasmine spies on event functions, which may trigger at initialization
        // of the slide-toggle component.
        spyOn(
          fixture.debugElement.componentInstance,
          'onSlideChange'
        ).and.callThrough();
        spyOn(
          fixture.debugElement.componentInstance,
          'onSlideClick'
        ).and.callThrough();

        // Initialize the slide-toggle component, by triggering the first change detection cycle.
        fixture.detectChanges();

        const slideToggleDebug = fixture.debugElement.query(
          By.css('is-slide-toggle')
        );

        slideToggle = slideToggleDebug.componentInstance;
        slideToggleElement = slideToggleDebug.nativeElement;
        slideToggleModel = slideToggleDebug.injector.get<NgModel>(NgModel);
        inputElement = fixture.debugElement.query(By.css('input'))
          .nativeElement;
        labelElement = fixture.debugElement.query(By.css('label'))
          .nativeElement;
        barElement = fixture.debugElement.query(By.css('.is-slide-toggle__bar'))
          .nativeElement;
      })
    );

    it(
      'should update the model correctly',
      async(() => {
        expect(slideToggleElement.classList).not.toContain(
          'is-slide-toggle--checked'
        );

        testComponent.slideModel = true;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(slideToggleElement.classList).toContain(
            'is-slide-toggle--checked'
          );
        });
      })
    );

    it('should apply off color based on color attribute', () => {
      testComponent.slideOffColor = 'rgb(255, 0, 0)';
      fixture.detectChanges();
      expect(barElement.style.color).toBe('rgb(255, 0, 0)');

      testComponent.slideOffColor = 'rgb(0, 255, 0)';
      fixture.detectChanges();

      expect(barElement.style.color).toContain('rgb(0, 255, 0)');
    });

    it('should apply color based on color attribute', async(() => {
      testComponent.slideOffColor = 'rgb(255, 0, 0)';
      testComponent.slideColor = 'rgb(0, 255, 0)';
      fixture.detectChanges();
      expect(barElement.style.color).toBe('rgb(255, 0, 0)');
      testComponent.slideModel = true;

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(barElement.style.color).toContain('rgb(0, 255, 0)');
      });
    }));

    it('should correctly update the disabled property', () => {
      expect(inputElement.disabled).toBeFalsy();

      testComponent.isDisabled = true;
      fixture.detectChanges();

      expect(inputElement.disabled).toBeTruthy();
    });

    it('should correctly update the checked property', () => {
      expect(slideToggle.checked).toBeFalsy();

      testComponent.slideChecked = true;
      fixture.detectChanges();

      expect(inputElement.checked).toBeTruthy();
    });

    it('should set the toggle to checked on click', () => {
      expect(slideToggle.checked).toBe(false);
      expect(slideToggleElement.classList).not.toContain(
        'is-slide-toggle--checked'
      );

      labelElement.click();
      fixture.detectChanges();

      expect(slideToggleElement.classList).toContain(
        'is-slide-toggle--checked'
      );
      expect(slideToggle.checked).toBe(true);
    });

    it('should not trigger the click event multiple times', () => {
      expect(slideToggle.checked).toBe(false);
      expect(slideToggleElement.classList).not.toContain(
        'is-slide-toggle--checked'
      );

      labelElement.click();
      fixture.detectChanges();

      expect(slideToggleElement.classList).toContain(
        'is-slide-toggle--checked'
      );
      expect(slideToggle.checked).toBe(true);
      expect(testComponent.onSlideClick).toHaveBeenCalledTimes(1);
    });

    it('should trigger the change event properly', () => {
      expect(inputElement.checked).toBe(false);
      expect(slideToggleElement.classList).not.toContain(
        'is-slide-toggle--checked'
      );

      labelElement.click();
      fixture.detectChanges();

      expect(inputElement.checked).toBe(true);
      expect(slideToggleElement.classList).toContain(
        'is-slide-toggle--checked'
      );
      expect(testComponent.onSlideChange).toHaveBeenCalledTimes(1);
    });

    it(
      'should not trigger the change event by changing the native value',
      async(() => {
        expect(inputElement.checked).toBe(false);
        expect(slideToggleElement.classList).not.toContain(
          'is-slide-toggle--checked'
        );

        testComponent.slideChecked = true;
        fixture.detectChanges();

        expect(inputElement.checked).toBe(true);
        expect(slideToggleElement.classList).toContain(
          'is-slide-toggle--checked'
        );

        // The change event shouldn't fire because the value change was not caused
        // by any interaction. Use whenStable to ensure an event isn't fired asynchronously.
        fixture.whenStable().then(() => {
          expect(testComponent.onSlideChange).not.toHaveBeenCalled();
        });
      })
    );

    it(
      'should not trigger the change event on initialization',
      async(() => {
        expect(inputElement.checked).toBe(false);
        expect(slideToggleElement.classList).not.toContain(
          'is-slide-toggle--checked'
        );

        testComponent.slideChecked = true;
        fixture.detectChanges();

        expect(inputElement.checked).toBe(true);
        expect(slideToggleElement.classList).toContain(
          'is-slide-toggle--checked'
        );

        // The change event shouldn't fire, because the native input element is not focused.
        // Use whenStable to ensure an event isn't fired asynchronously.
        fixture.whenStable().then(() => {
          expect(testComponent.onSlideChange).not.toHaveBeenCalled();
        });
      })
    );

    it('should add a suffix to the inputs id', () => {
      testComponent.slideId = 'myId';
      fixture.detectChanges();

      expect(inputElement.id).toBe('myId-input');

      testComponent.slideId = 'nextId';
      fixture.detectChanges();

      expect(inputElement.id).toBe('nextId-input');

      testComponent.slideId = null;
      fixture.detectChanges();

      // Once the id input is falsy, we use a default prefix with a incrementing unique number.
      expect(inputElement.id).toMatch(/is-slide-toggle-[0-9]+-input/g);
    });

    it('should forward the tabIndex to the underlying input', () => {
      fixture.detectChanges();

      expect(inputElement.tabIndex).toBe(0);

      testComponent.slideTabindex = 4;
      fixture.detectChanges();

      expect(inputElement.tabIndex).toBe(4);
    });

    it('should forward the specified name to the input', () => {
      testComponent.slideName = 'myName';
      fixture.detectChanges();

      expect(inputElement.name).toBe('myName');

      testComponent.slideName = 'nextName';
      fixture.detectChanges();

      expect(inputElement.name).toBe('nextName');

      testComponent.slideName = null;
      fixture.detectChanges();

      expect(inputElement.name).toBe('');
    });

    it('should forward the aria-label attribute to the input', () => {
      testComponent.slideLabel = 'ariaLabel';
      fixture.detectChanges();

      expect(inputElement.getAttribute('aria-label')).toBe('ariaLabel');

      testComponent.slideLabel = null;
      fixture.detectChanges();

      expect(inputElement.hasAttribute('aria-label')).toBeFalsy();
    });

    it('should forward the aria-labelledby attribute to the input', () => {
      testComponent.slideLabelledBy = 'ariaLabelledBy';
      fixture.detectChanges();

      expect(inputElement.getAttribute('aria-labelledby')).toBe(
        'ariaLabelledBy'
      );

      testComponent.slideLabelledBy = null;
      fixture.detectChanges();

      expect(inputElement.hasAttribute('aria-labelledby')).toBeFalsy();
    });

    it('should be initially set to ng-pristine', () => {
      expect(slideToggleElement.classList).toContain('ng-pristine');
      expect(slideToggleElement.classList).not.toContain('ng-dirty');
    });

    it(
      'should emit the new values properly',
      async(() => {
        labelElement.click();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          // We're checking the arguments type / emitted value to be a boolean, because sometimes the
          // emitted value can be a DOM Event, which is not valid.
          // See angular/angular#4059
          expect(testComponent.lastEvent.checked).toBe(true);
        });
      })
    );

    it('should support subscription on the change observable', () => {
      slideToggle.change.subscribe((event: IsSlideToggleChange) => {
        expect(event.checked).toBe(true);
      });

      slideToggle.toggle();
      fixture.detectChanges();
    });

    it('should have the correct control state initially and after interaction', () => {
      // The control should start off valid, pristine, and untouched.
      expect(slideToggleModel.valid).toBe(true);
      expect(slideToggleModel.pristine).toBe(true);
      expect(slideToggleModel.touched).toBe(false);

      // After changing the value programmatically, the control should
      // become dirty (not pristine), but remain untouched.
      slideToggle.checked = true;
      fixture.detectChanges();

      expect(slideToggleModel.valid).toBe(true);
      expect(slideToggleModel.pristine).toBe(false);
      expect(slideToggleModel.touched).toBe(false);

      // After a user interaction occurs (such as a click), the control should remain dirty and
      // now also be touched.
      labelElement.click();
      fixture.detectChanges();

      expect(slideToggleModel.valid).toBe(true);
      expect(slideToggleModel.pristine).toBe(false);
      expect(slideToggleModel.touched).toBe(true);
    });

    it('should not set the control to touched when changing the state programmatically', () => {
      // The control should start off with being untouched.
      expect(slideToggleModel.touched).toBe(false);

      testComponent.slideChecked = true;
      fixture.detectChanges();

      expect(slideToggleModel.touched).toBe(false);
      expect(slideToggleElement.classList).toContain(
        'is-slide-toggle--checked'
      );

      // After a user interaction occurs (such as a click), the control should remain dirty and
      // now also be touched.
      inputElement.click();
      fixture.detectChanges();

      expect(slideToggleModel.touched).toBe(true);
      expect(slideToggleElement.classList).not.toContain(
        'is-slide-toggle--checked'
      );
    });

    it(
      'should not set the control to touched when changing the model',
      async(() => {
        // The control should start off with being untouched.
        expect(slideToggleModel.touched).toBe(false);

        testComponent.slideModel = true;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(slideToggleModel.touched).toBe(false);
          expect(slideToggle.checked).toBe(true);
          expect(slideToggleElement.classList).toContain(
            'is-slide-toggle--checked'
          );
        });
      })
    );

    it('should focus on underlying input element when focus() is called', () => {
      expect(document.activeElement).not.toBe(inputElement);

      slideToggle.focus();
      fixture.detectChanges();

      expect(document.activeElement).toBe(inputElement);
    });

    it('should set a element class if labelPosition is set to before', () => {
      expect(slideToggleElement.classList).not.toContain(
        'is-slide-toggle--label-before'
      );

      testComponent.labelPosition = 'before';
      fixture.detectChanges();

      expect(slideToggleElement.classList).toContain(
        'is-slide-toggle--label-before'
      );
    });
  });

  describe('custom', () => {
    it(
      'should not trigger the change event on initialization',
      async(() => {
        const fixture = TestBed.createComponent(SlideToggleTestApp);
        fixture.componentInstance.slideModel = true;
        fixture.componentInstance.slideChecked = true;
        fixture.detectChanges();

        expect(fixture.componentInstance.lastEvent).toBeFalsy();
      })
    );
  });

  describe('with dragging', () => {
    let fixture: ComponentFixture<any>;

    let testComponent: SlideToggleTestApp;
    let slideToggle: IsSlideToggle;
    let slideToggleElement: HTMLElement;
    let slideThumb: HTMLElement;
    let inputElement: HTMLInputElement;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(SlideToggleTestApp);
      fixture.detectChanges();

      const slideToggleDebug = fixture.debugElement.query(By.directive(IsSlideToggle));
      const thumbContainerDebug = slideToggleDebug
        .query(By.css('.is-slide-toggle__thumb'));

      testComponent = fixture.debugElement.componentInstance;
      slideToggle = slideToggleDebug.componentInstance;
      slideToggleElement = slideToggleDebug.nativeElement;
      slideThumb = thumbContainerDebug.nativeElement;

      inputElement = slideToggleElement.querySelector('input');
    }));

    it('should drag from start to end', fakeAsync(() => {
      expect(slideToggle.checked).toBe(false);
      slideThumb.dispatchEvent(new Event('slidestart'));
      fixture.detectChanges();

      expect(slideThumb.classList).toContain('is-dragging');
      mockEvent['deltaX'] = 200;
      slideThumb.dispatchEvent(mockEvent);

      slideThumb.dispatchEvent(new Event('slideend'));

      // Flush the timeout for the slide ending.
      tick();

      expect(slideToggle.checked).toBe(true);
      expect(slideThumb.classList).not.toContain('is-dragging');
    }));

    it('should drag from end to start', fakeAsync(() => {
      slideToggle.checked = true;
      slideThumb.dispatchEvent(new Event('slidestart'));
      fixture.detectChanges();
      expect(slideThumb.classList).toContain('is-dragging');

      mockEvent['deltaX'] = -200;
      slideThumb.dispatchEvent(mockEvent);

      slideThumb.dispatchEvent(new Event('slideend'));

      // Flush the timeout for the slide ending.
      tick();

      expect(slideToggle.checked).toBe(false);
      expect(slideThumb.classList).not.toContain('is-dragging');
    }));

    it('should not drag when disabled', fakeAsync(() => {
      slideToggle.disabled = true;

      expect(slideToggle.checked).toBe(false);

      slideThumb.dispatchEvent(new Event('slidestart'));

      expect(slideThumb.classList).not.toContain('is-dragging');

      mockEvent['deltaX'] = 200;
      slideThumb.dispatchEvent(mockEvent);

      slideThumb.dispatchEvent(new Event('slideend'));

      // Flush the timeout for the slide ending.
      tick();

      expect(slideToggle.checked).toBe(false);
      expect(slideThumb.classList).not.toContain('is-dragging');
    }));

    it('should should emit a change event after drag', fakeAsync(() => {
      expect(slideToggle.checked).toBe(false);

      slideThumb.dispatchEvent(new Event('slidestart'));
      fixture.detectChanges();

      expect(slideThumb.classList).toContain('is-dragging');

      mockEvent['deltaX'] = 200;
      slideThumb.dispatchEvent(mockEvent);
      slideThumb.dispatchEvent(new Event('slideend'));

      // Flush the timeout for the slide ending.
      tick();

      expect(slideToggle.checked).toBe(true);
      expect(slideThumb.classList).not.toContain('is-dragging');
      expect(testComponent.lastEvent.checked).toBe(true);
    }));

    it('should not emit a change event when the value did not change', fakeAsync(() => {
      expect(slideToggle.checked).toBe(false);

      slideThumb.dispatchEvent(new Event('slidestart'));
      mockEvent['deltaX'] = 0;
      slideThumb.dispatchEvent(mockEvent);
      slideThumb.dispatchEvent(new Event('slideend'));

      // Flush the timeout for the slide ending.
      tick();

      expect(slideThumb.classList).not.toContain('is-dragging');
      expect(slideToggle.checked).toBe(false);
      expect(testComponent.lastEvent)
        .toBeFalsy('Expected the slide-toggle to not emit a change event.');
    }));

    it('should ignore clicks on the label element while dragging', fakeAsync(() => {
      expect(slideToggle.checked).toBe(false);

      slideThumb.dispatchEvent(new Event('slidestart'));
      mockEvent['deltaX'] = 200;
      slideThumb.dispatchEvent(mockEvent);
      slideThumb.dispatchEvent(new Event('slideend'));

      expect(slideToggle.checked).toBe(true);

      // Fake a change event that has been fired after dragging through the click on pointer
      // release (noticeable on IE11, Edge)
      inputElement.checked = false;
      inputElement.dispatchEvent(new Event('change'));

      // Flush the timeout for the slide ending.
      tick();

      expect(slideThumb.classList).not.toContain('is-dragging');
      expect(slideToggle.checked).toBe(true);
    }));

    it('should update the checked property of the input', fakeAsync(() => {
      expect(inputElement.checked).toBe(false);

      slideThumb.dispatchEvent(new Event('slidestart'));
      fixture.detectChanges();
      expect(slideThumb.classList).toContain('is-dragging');

      mockEvent['deltaX'] = 200;
      slideThumb.dispatchEvent(mockEvent);

      slideThumb.dispatchEvent(new Event('slideend'));
      fixture.detectChanges();

      expect(inputElement.checked).toBe(true);

      // Flush the timeout for the slide ending.
      tick();

      expect(slideThumb.classList).not.toContain('is-dragging');
    }));
  });

  describe('with a FormControl', () => {
    let fixture: ComponentFixture<SlideToggleWithFormControl>;

    let testComponent: SlideToggleWithFormControl;
    let slideToggle: IsSlideToggle;
    let inputElement: HTMLInputElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(SlideToggleWithFormControl);
      fixture.detectChanges();

      testComponent = fixture.debugElement.componentInstance;
      slideToggle = fixture.debugElement.query(By.directive(IsSlideToggle))
        .componentInstance;
      inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should toggle the disabled state', () => {
      expect(slideToggle.disabled).toBe(false);
      expect(inputElement.disabled).toBe(false);

      testComponent.formControl.disable();
      fixture.detectChanges();

      expect(slideToggle.disabled).toBe(true);
      expect(inputElement.disabled).toBe(true);

      testComponent.formControl.enable();
      fixture.detectChanges();

      expect(slideToggle.disabled).toBe(false);
      expect(inputElement.disabled).toBe(false);
    });
  });

  describe('with dragging', () => {
    let fixture: ComponentFixture<any>;

    let testComponent: SlideToggleTestApp;
    let slideToggle: IsSlideToggle;
    let slideToggleElement: HTMLElement;
    let slideThumb: HTMLElement;
    let inputElement: HTMLInputElement;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(SlideToggleTestApp);
      fixture.detectChanges();

      const slideToggleDebug = fixture.debugElement.query(By.directive(IsSlideToggle));
      const thumbContainerDebug = slideToggleDebug
        .query(By.css('.is-slide-toggle__thumb'));

      testComponent = fixture.debugElement.componentInstance;
      slideToggle = slideToggleDebug.componentInstance;
      slideToggleElement = slideToggleDebug.nativeElement;
      slideThumb = thumbContainerDebug.nativeElement;

      inputElement = slideToggleElement.querySelector('input');
    }));

    it('should drag from start to end', fakeAsync(() => {
      expect(slideToggle.checked).toBe(false);

      slideThumb.dispatchEvent(new Event('slidestart'));

      expect(slideThumb.classList).toContain('is-dragging');

      mockEvent['deltaX'] = 200;
      slideThumb.dispatchEvent(mockEvent);

      slideThumb.dispatchEvent(new Event('slideend'));

      // Flush the timeout for the slide ending.
      tick();

      expect(slideToggle.checked).toBe(true);
      expect(slideThumb.classList).not.toContain('is-dragging');
    }));

    it('should drag from end to start', fakeAsync(() => {
      slideToggle.checked = true;

      slideThumb.dispatchEvent(new Event('slidestart'));

      expect(slideThumb.classList).toContain('is-dragging');

      mockEvent['deltaX'] = -200;
      slideThumb.dispatchEvent(mockEvent);

      slideThumb.dispatchEvent(new Event('slideend'));

      // Flush the timeout for the slide ending.
      tick();

      expect(slideToggle.checked).toBe(false);
      expect(slideThumb.classList).not.toContain('is-dragging');
    }));

    it('should not drag when disabled', fakeAsync(() => {
      slideToggle.disabled = true;

      expect(slideToggle.checked).toBe(false);

      slideThumb.dispatchEvent(new Event('slidestart'));

      expect(slideThumb.classList).not.toContain('is-dragging');

      mockEvent['deltaX'] = 200;
      slideThumb.dispatchEvent(mockEvent);

      slideThumb.dispatchEvent(new Event('slideend'));

      // Flush the timeout for the slide ending.
      tick();

      expect(slideToggle.checked).toBe(false);
      expect(slideThumb.classList).not.toContain('is-dragging');
    }));

    it('should should emit a change event after drag', fakeAsync(() => {
      expect(slideToggle.checked).toBe(false);

      slideThumb.dispatchEvent(new Event('slidestart'));

      expect(slideThumb.classList).toContain('is-dragging');

      mockEvent['deltaX'] = 200;
      slideThumb.dispatchEvent(mockEvent);

      slideThumb.dispatchEvent(new Event('slideend'));

      // Flush the timeout for the slide ending.
      tick();

      expect(slideToggle.checked).toBe(true);
      expect(slideThumb.classList).not.toContain('is-dragging');
      expect(testComponent.lastEvent.checked).toBe(true);
    }));

    it('should not emit a change event when the value did not change', fakeAsync(() => {
      expect(slideToggle.checked).toBe(false);

      slideThumb.dispatchEvent(new Event('slidestart'));
      mockEvent['deltaX'] = 0;
      slideThumb.dispatchEvent(mockEvent);
      slideThumb.dispatchEvent(new Event('slideend'));

      // Flush the timeout for the slide ending.
      tick();

      expect(slideThumb.classList).not.toContain('is-dragging');
      expect(slideToggle.checked).toBe(false);
      expect(testComponent.lastEvent)
        .toBeFalsy('Expected the slide-toggle to not emit a change event.');
    }));

    it('should ignore clicks on the label element while dragging', fakeAsync(() => {
      expect(slideToggle.checked).toBe(false);

      slideThumb.dispatchEvent(new Event('slidestart'));
      mockEvent['deltaX'] = 200;
      slideThumb.dispatchEvent(mockEvent);
      slideThumb.dispatchEvent(new Event('slideend'));

      expect(slideToggle.checked).toBe(true);

      // Fake a change event that has been fired after dragging through the click on pointer
      // release (noticeable on IE11, Edge)
      inputElement.checked = false;
      inputElement.dispatchEvent(new Event('change'));

      // Flush the timeout for the slide ending.
      tick();

      expect(slideThumb.classList).not.toContain('is-dragging');
      expect(slideToggle.checked).toBe(true);
    }));

    it('should update the checked property of the input', fakeAsync(() => {
      expect(inputElement.checked).toBe(false);

      slideThumb.dispatchEvent(new Event('slidestart'));

      expect(slideThumb.classList).toContain('is-dragging');

      mockEvent['deltaX'] = 200;
      slideThumb.dispatchEvent(mockEvent);

      slideThumb.dispatchEvent(new Event('slideend'));
      fixture.detectChanges();

      expect(inputElement.checked).toBe(true);

      // Flush the timeout for the slide ending.
      tick();

      expect(slideThumb.classList).not.toContain('is-dragging');
    }));
  });
});

@Component({
  selector: 'slide-toggle-test-app',
  template: `
    <is-slide-toggle [(ngModel)]="slideModel"
                     [disabled]="isDisabled"
                     [color]="slideColor"
                     [offColor]="slideOffColor"
                     [id]="slideId"
                     [checked]="slideChecked"
                     [name]="slideName"
                     [aria-label]="slideLabel"
                     [aria-labelledby]="slideLabelledBy"
                     [tabIndex]="slideTabindex"
                     [labelPosition]="labelPosition"
                     (change)="onSlideChange($event)"
                     (click)="onSlideClick($event)">
      <span>Test Slide Toggle</span>
    </is-slide-toggle>`
})
class SlideToggleTestApp {
  isDisabled = false;
  slideModel = false;
  slideChecked = false;
  slideColor: string;
  slideOffColor: string;
  slideId: string;
  slideName: string;
  slideLabel: string;
  slideLabelledBy: string;
  slideTabindex: number;
  lastEvent: IsSlideToggleChange;
  labelPosition: string;

  onSlideClick(event: Event) {}
  onSlideChange(event: IsSlideToggleChange) {
    this.lastEvent = event;
  }
}

@Component({
  template: `
    <is-slide-toggle [formControl]="formControl">
      <span>Test Slide Toggle</span>
    </is-slide-toggle>`
})
class SlideToggleWithFormControl {
  formControl = new FormControl();
}
