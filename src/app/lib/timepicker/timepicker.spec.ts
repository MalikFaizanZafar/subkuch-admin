import { IsTimePickerMeridian } from './timepicker.model';
import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { IsTimePicker } from './timepicker';

describe('IsTimePicker', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        IsTimePicker,
        TimePickerCompTest
      ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    TestBed.compileComponents();
  }));

  describe('basic behaviors', () => {
    let fixture: ComponentFixture<any>;
    let testComponent: TimePickerCompTest;
    let timepicker: IsTimePicker;
    let timepickerElement: HTMLElement;
    let inputDivElement: HTMLDivElement;
    let inputElements: HTMLCollection;
    let hourElement: HTMLInputElement;
    let minuteElement: HTMLInputElement;
    let meridianElement: HTMLInputElement;
    let uiUpArrowElement: HTMLCollection;
    let hourUpElement: HTMLDivElement;
    let minuteUpElement: HTMLDivElement;
    let uiDownArrowElement: HTMLCollection;
    let hourDownElement: HTMLDivElement;
    let minuteDownElement: HTMLDivElement;
    let uiTimeElement: HTMLCollection;
    let hourTimeElement: HTMLSpanElement;
    let minuteTimeElement: HTMLSpanElement;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(TimePickerCompTest);
      testComponent = fixture.debugElement.componentInstance;
      // Initialize the slide-toggle component, by triggering the first change detection cycle.
      fixture.detectChanges();

      const timepickerDebug = fixture.debugElement.query(
        By.directive(IsTimePicker)
      );

      timepicker = timepickerDebug.componentInstance;
      timepickerElement = timepickerDebug.nativeElement;
      inputDivElement = fixture.debugElement.query(By.css('.is-timepicker__input')).nativeElement;
      inputElements = inputDivElement.children;
      hourElement = <HTMLInputElement> inputElements[0];
      minuteElement = <HTMLInputElement> inputElements[2];
      meridianElement = <HTMLInputElement> inputElements[3];
    }));

    it('should set time on input elements in 12hour format by default', () => {
      const time = new Date();
      time.setHours(14);
      time.setMinutes(13);
      testComponent.time = time;
      testComponent.isFormat24Hour = false;
      testComponent.isAlwaysVisible = false;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(timepicker.state.hours).toEqual('02');
        expect(timepicker.state.minutes).toEqual('13');
        expect(timepicker.state.meridian).toEqual(IsTimePickerMeridian.PM);
      });
    });

    it('should set time on input elements in 24 hour format when isFormat24Hour is true', () => {
      const time = new Date();
      time.setHours(14);
      time.setMinutes(13);
      testComponent.time = time;
      testComponent.isFormat24Hour = true;
      testComponent.isAlwaysVisible = false;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(timepicker.state.hours).toEqual('14');
        expect(timepicker.state.minutes).toEqual('13');
      });
    });

    it('should always show time input div when isAlwaysVisible is true', () => {
      const time = new Date();
      time.setHours(14);
      time.setMinutes(13);
      testComponent.time = time;
      testComponent.isAlwaysVisible = true;

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const isInputFocused = timepicker.anyInputFocused();
        expect(isInputFocused).toBeFalsy();
        expect(inputDivElement.classList).toContain('is-timepicker__input--visible');
        expect(timepicker.isTimepickerVisible).toBeTruthy();
        expect(timepicker.state.hoursFocused).toBeFalsy();
        expect(timepicker.state.minutesFocused).toBeFalsy();
        expect(timepicker.state.meridianFocused).toBeFalsy();
      });
    });

    it('should show time input div when isAlwaysVisible is false but input is focused', async(() => {
      spyOn(timepicker, 'updateFocus').and.callThrough();
      const time = new Date();
      time.setHours(14);
      time.setMinutes(13);
      testComponent.time = time;
      testComponent.isAlwaysVisible = false;
      hourElement.dispatchEvent(new Event('focus'));
      fixture.detectChanges();

      expect(timepicker.updateFocus).toHaveBeenCalled();
      const isInputFocused = timepicker.anyInputFocused();
      expect(isInputFocused).toBeTruthy();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(timepicker.state.hoursFocused).toBeTruthy();
        expect(timepicker.state.minutesFocused).toBeFalsy();
        expect(timepicker.state.meridianFocused).toBeFalsy();
      });
    }));

    it('should set time on component when hour is set programmatically', () => {
      const time = new Date();
      time.setHours(12);
      time.setMinutes(13);
      testComponent.time = time;
      spyOn(timepicker, 'checkHours').and.callThrough();
      spyOn(timepicker, 'checkNumber').and.callThrough();
      spyOn(timepicker, 'updateFocus').and.callThrough();
      hourElement.dispatchEvent(new Event('focus'));
      hourElement.value = '10';
      hourElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      time.setHours(10);

      expect(timepicker.updateFocus).toHaveBeenCalled();
      hourElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(timepicker.checkHours).toHaveBeenCalled();
      expect(timepicker.checkNumber).toHaveBeenCalledWith('hours', 0, 12);
      expect(timepicker.state.hours).toEqual('10');
      expect(testComponent.time).toEqual(time);
    });


    it('should set time on component when hour is set more than 23 programmatically', () => {
      const time = new Date();
      time.setHours(12);
      time.setMinutes(13);
      testComponent.time = time;
      testComponent.isFormat24Hour = true;
      spyOn(timepicker, 'checkHours').and.callThrough();
      spyOn(timepicker, 'checkNumber').and.callThrough();
      spyOn(timepicker, 'updateFocus').and.callThrough();
      hourElement.dispatchEvent(new Event('focus'));
      hourElement.value = '25';
      hourElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      time.setHours(12);

      expect(timepicker.updateFocus).toHaveBeenCalled();
      hourElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(timepicker.checkHours).toHaveBeenCalled();
      expect(timepicker.checkNumber).toHaveBeenCalledWith('hours', 0, 23);
      expect(timepicker.state.hours).toEqual('23');
      expect(testComponent.time).toEqual(time);
    });

    it('should set time on component when hour is set less than 12 programmatically', () => {
      const time = new Date();
      time.setHours(12);
      time.setMinutes(13);
      testComponent.time = time;
      spyOn(timepicker, 'checkHours').and.callThrough();
      spyOn(timepicker, 'checkNumber').and.callThrough();
      spyOn(timepicker, 'updateFocus').and.callThrough();
      hourElement.dispatchEvent(new Event('focus'));
      hourElement.value = '-1';
      hourElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      time.setHours(0);

      expect(timepicker.updateFocus).toHaveBeenCalled();
      hourElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(timepicker.checkHours).toHaveBeenCalled();
      expect(timepicker.checkNumber).toHaveBeenCalledWith('hours', 0, 12);
      expect(timepicker.state.hours).toEqual('00');
      expect(testComponent.time).toEqual(time);
    });

    it('should set time on component when minutes is set programmatically', () => {
      const time = new Date();
      time.setHours(12);
      time.setMinutes(13);
      testComponent.time = time;
      spyOn(timepicker, 'checkMinutes').and.callThrough();
      spyOn(timepicker, 'checkNumber').and.callThrough();
      spyOn(timepicker, 'updateFocus').and.callThrough();
      minuteElement.dispatchEvent(new Event('focus'));
      minuteElement.value = '10';
      minuteElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      time.setMinutes(10);

      expect(timepicker.updateFocus).toHaveBeenCalled();
      minuteElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(timepicker.checkMinutes).toHaveBeenCalled();
      expect(timepicker.checkNumber).toHaveBeenCalledWith('minutes', 0, 59);
      expect(testComponent.time).toEqual(time);
    });

    it('should set time on test component when meridian is set programmatically', async(() => {
      const time = new Date();
      time.setHours(14);
      time.setMinutes(13);
      testComponent.time = time;
      spyOn(timepicker, 'checkMeridian').and.callThrough();
      spyOn(timepicker, 'checkNumber').and.callThrough();
      spyOn(timepicker, 'updateFocus').and.callThrough();
      fixture.whenStable().then(() => {
        meridianElement.dispatchEvent(new Event('focus'));
        meridianElement.value = 'AM';
        meridianElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(timepicker.updateFocus).toHaveBeenCalled();
        meridianElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(timepicker.checkMeridian).toHaveBeenCalled();
        expect(timepicker.state.meridian).toEqual(IsTimePickerMeridian.AM);
        expect(testComponent.time).toEqual(time);

        meridianElement.dispatchEvent(new Event('focus'));
        meridianElement.value = 'PM';
        meridianElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(timepicker.updateFocus).toHaveBeenCalled();
        meridianElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(timepicker.checkMeridian).toHaveBeenCalled();
        expect(timepicker.state.meridian).toEqual(IsTimePickerMeridian.PM);
        expect(testComponent.time).toEqual(time);
      });
    }));

    it('should reset the state when the time is set to null programmatically', async(() => {
      const time = new Date();
      time.setHours(10);
      time.setMinutes(30);
      testComponent.time = time;

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(timepicker.state.hours).toBe('10');
        expect(timepicker.state.minutes).toBe('30');

        testComponent.time = null;

        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(timepicker.state.hours).toBe('');
          expect(timepicker.state.minutes).toBe('');
        });
      });
    }));

    it('should show only allow numbers in hour textbox', async(() => {
      const time = new Date();
      time.setHours(12);
      time.setMinutes(13);
      testComponent.time = time;
      spyOn(timepicker, 'onlyNumbers').and.callThrough();
      hourElement.dispatchEvent(new Event('focus'));
      const e = new KeyboardEvent('keypress', {
        key: 'a',
        bubbles: true,
        cancelable: true,
      });
      hourElement.dispatchEvent(e);
      hourElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      expect(timepicker.onlyNumbers).toHaveBeenCalledWith(e);
      expect(timepicker.state.hours).toEqual('');
    }));

    it('should only allow ampm in meridian textbox', async(() => {
      spyOn(timepicker, 'onlyMeridian').and.callThrough();
      meridianElement.dispatchEvent(new Event('focus'));
      const e = new KeyboardEvent('keypress', {
        key: 'a',
        bubbles: true,
        cancelable: true,
      });
      meridianElement.dispatchEvent(e);
      meridianElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      expect(timepicker.onlyMeridian).toHaveBeenCalledWith(e);
      // TODO verify this
      // because the template is using ngModel in a text input and binding it directly to timepicker.state.meridian
      // it gets written as an empty string, which may be undesirable behavior
      expect(timepicker.state.meridian).toBe('' as any);
    }));

    it('should show by default focus on hour textbox', async(() => {
      const time = new Date();
      time.setHours(12);
      time.setMinutes(13);
      testComponent.time = time;
      spyOn(timepicker, 'onInputClick').and.callThrough();
      inputDivElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      expect(timepicker.onInputClick).toHaveBeenCalled();
      expect(timepicker.state.inputFocused).toBeTruthy();

    }));

    it('should set update time on test component when hour is increased by up arrow programmatically', async(() => {
      spyOn(timepicker, 'updateBy').and.callThrough();
      const time = new Date();
      time.setHours(3);
      time.setMinutes(13);
      testComponent.time = time;
      testComponent.isAlwaysVisible = true;
      fixture.detectChanges();
      uiUpArrowElement = fixture.debugElement.query(By.css('.left-row--up')).nativeElement.children;
      hourUpElement = <HTMLDivElement> uiUpArrowElement[0];
      minuteUpElement = <HTMLDivElement> uiUpArrowElement[1];
      uiDownArrowElement = fixture.debugElement.query(By.css('.left-row--down')).nativeElement.children;
      hourDownElement = <HTMLDivElement> uiDownArrowElement[0];
      minuteDownElement = <HTMLDivElement> uiDownArrowElement[1];
      uiTimeElement = fixture.debugElement.query(By.css('.is-timepicker__ui-left-row--mid')).nativeElement.children;
      hourTimeElement = <HTMLSpanElement> uiTimeElement[0];
      minuteTimeElement = <HTMLSpanElement> uiTimeElement[2];

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(hourTimeElement.innerText).toEqual('03');
        expect(minuteTimeElement.innerText).toEqual('13');
        hourUpElement.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        expect(timepicker.updateBy).toHaveBeenCalled();
        expect(hourTimeElement.innerText).toEqual('04');

        minuteDownElement.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        expect(timepicker.updateBy).toHaveBeenCalled();
        expect(minuteTimeElement.innerText).toEqual('12');
      });
    }));
  });
});

/** Component for testing timepicker. */
@Component({
  template: `
    <is-timepicker
      [(ngModel)]="time"
      [format24Hour]="isFormat24Hour"
      [alwaysVisible]="isAlwaysVisible"
      (update)="onTimeChanged($event)">
    </is-timepicker>`
})
class TimePickerCompTest {
  time: Date;
  isFormat24Hour: boolean;
  isAlwaysVisible: boolean;

  onTimeChanged(event) {
  }
}
