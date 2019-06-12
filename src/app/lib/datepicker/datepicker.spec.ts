import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IsInputModule } from '../input/input.module';
import { IsDatepicker } from './datepicker';
import { IsDatePickerPlacement, IsDate } from './datepicker.models';
import { OverlayModule } from '@angular/cdk/overlay';

function getRenderedDay(date: Date): IsDate {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    isToday: false,
    isPast: true
  };
}

describe('IsDatepicker', () => {

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule,
          ReactiveFormsModule,
          IsInputModule,
          BrowserAnimationsModule,
          OverlayModule
        ],
        declarations: [
          IsDatepicker,
          DatepickerTestApp
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      });

      TestBed.compileComponents();
    })
  );

  describe('basic behavior', () => {
    let fixture: ComponentFixture<any>;

    let testComponent: DatepickerTestApp;
    let datepicker: IsDatepicker;
    let datepickerElement: HTMLElement;
    let datepickerInputElement: HTMLInputElement;
    let datepickerInputContainer: HTMLElement;
    let datepickerShowTodayElement: HTMLDivElement;

    // This initialization is async() because it needs to wait for ngModel to set the initial value.
    beforeEach(
      async(() => {
        fixture = TestBed.createComponent(DatepickerTestApp);
        testComponent = fixture.debugElement.componentInstance;
        // Initialize the slide-toggle component, by triggering the first change detection cycle.
        fixture.detectChanges();

        const datepickerToggleDebug = fixture.debugElement.query(
          By.directive(IsDatepicker)
        );

        datepicker = datepickerToggleDebug.componentInstance;
        datepickerInputContainer = fixture.debugElement.query(By.css('.is-datepicker__input'))
          .nativeElement;
        datepickerInputElement = fixture.debugElement.query(By.css('input'))
          .nativeElement;
      })
    );

    it('should initialize input element when date is set on ngModel', async(() => {
      spyOn(datepicker, 'renderMonth').and.callThrough();
      const date = new Date(2017, 7, 8);
      testComponent.datepickerData = date;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(datepicker.selectedDate).toEqual(date);
        expect(datepicker.active).toBeFalsy();
        expect(datepicker.currentDate).toEqual(new Date(2017, 7, 1));
        expect(datepicker.renderMonth).toHaveBeenCalled();
      });
    }));

    it('should clear input element when date is set to a nullable value', async(() => {
      const date = new Date();
      testComponent.datepickerData = date;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(datepicker.dateInput.nativeElement.value).not.toBe('');
        testComponent.datepickerData = null;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(datepicker.dateInput.nativeElement.value).toBe('');
        });
      });
    }));

    it('should set input element to current date when date is not set on ngModel', async(() => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(datepickerInputElement.value).toEqual('');
        expect(datepicker.selectedDate.getTime()).toEqual(date.getTime());
        expect(datepicker.currentDate.getTime()).toEqual(date.getTime());
      });
    }));

    it('should show datepicker element when alwaysVisible is true', async(() => {
      expect(datepickerInputContainer.nextElementSibling).toBeNull();
      testComponent.datepickerData = new Date(2017, 4, 8);
      testComponent.isAlwaysVisible = true;

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(datepickerInputContainer.nextElementSibling).not.toBeNull();
      });
    }));

    it('should showToday button when showToday is true', async(() => {
      testComponent.datepickerData = new Date(2015, 7, 8);
      testComponent.isAlwaysVisible = true;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        datepickerElement = fixture.debugElement.query(By.css('.is-datepicker'))
          .nativeElement;
        expect(datepickerElement.childElementCount).toBe(3);
        testComponent.showTodayBtn = true;
        fixture.detectChanges();
        expect(datepickerElement.childElementCount).toBe(4);
      });
    }));

    it('should set selectedDate to today date when Today button is clicked', async(() => {
      spyOn(datepicker, 'setDateToday').and.callThrough();
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0);
      testComponent.datepickerData = new Date(2017, 7, 6);
      testComponent.showTodayBtn = true;
      testComponent.isAlwaysVisible = true;
      testComponent.hideOnSelect = true;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        datepickerShowTodayElement = fixture.debugElement.query(By.css('.is-datepicker__today'))
          .nativeElement;
        datepickerShowTodayElement.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(datepicker.setDateToday).toHaveBeenCalled();
          expect(datepicker.areDatesEqual(datepicker.selectedDate, currentDate)).toBeTruthy();
          expect(datepicker.calendarFocused).toBeFalsy();
          expect(datepicker.active).toBeTruthy();
        });
      });
    }));

    it('should show the calendar when the container is clicked', async(() => {
      spyOn(datepicker, 'toggleActiveStatus').and.callThrough();
      datepicker.selectedDate = new Date();
      datepickerInputContainer.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(datepicker.toggleActiveStatus).toHaveBeenCalled();
        expect(datepicker.active).toBeTruthy();
        expect(fixture.debugElement.query(By.css('.is-datepicker'))).not.toBeNull();
      });
    }));

    it('should place datepicker to top if placement is changed ', async(() => {
      expect(datepicker.defaultPlacement).toEqual(IsDatePickerPlacement.Bottom);
      expect(datepicker.placement).toEqual(IsDatePickerPlacement.Bottom);
      expect(datepickerInputContainer.classList).not.toContain('is-datepicker__input--focused');
      testComponent.datepickerData = new Date();
      testComponent.dpPlacement = 'top';
      testComponent.isAlwaysVisible = true;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(datepicker.placement).toEqual(IsDatePickerPlacement.Top);
        expect(datepicker.active).toBeTruthy();
        expect(datepickerInputContainer.classList).toContain('is-datepicker__input--focused');
        datepickerElement = fixture.debugElement.query(By.css('.is-datepicker'))
          .nativeElement;
        expect(datepickerElement.classList).toContain('is-datepicker--top');
      });
    }));

    it('calling showPreviousMonth should render previous month details', () => {
      datepicker.currentDate = new Date(2017, 8, 9);
      spyOn(datepicker, 'renderMonth').and.callThrough();
      datepicker.showPreviousMonth();
      fixture.detectChanges();
      expect(datepicker.renderMonth).toHaveBeenCalledWith(2017, 7);
      datepicker.currentDate = new Date(2017, 0, 9);
      datepicker.showPreviousMonth();
      fixture.detectChanges();
      expect(datepicker.renderMonth).toHaveBeenCalledWith(2016, 11);
    });

    it('calling showNextMonth should render next month details', () => {
      datepicker.currentDate = new Date(2017, 8, 9);
      spyOn(datepicker, 'renderMonth').and.callThrough();
      datepicker.showNextMonth();
      fixture.detectChanges();
      expect(datepicker.renderMonth).toHaveBeenCalledWith(2017, 9);
      datepicker.currentDate = new Date(2017, 11, 9);
      datepicker.showNextMonth();
      fixture.detectChanges();
      expect(datepicker.renderMonth).toHaveBeenCalledWith(2018, 0);
    });

    it('should only enable future dates when direction is 1', () => {
      let date = new Date(2017, 7, 2);
      // Build the rendered date
      let renderedDay = getRenderedDay(date);
      testComponent.dateDirection = 1;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        let dateDisabled = datepicker.isDateDisabled(renderedDay);
        expect(dateDisabled).toBeTruthy();
        date = new Date();
        date.setHours(0, 0, 0);
        renderedDay = getRenderedDay(date);
        dateDisabled = datepicker.isDateDisabled(renderedDay);
        expect(dateDisabled).toBeTruthy();

        const tomorrow = new Date();
        tomorrow.setDate(date.getDate() + 1);
        tomorrow.setHours(0, 0, 0);
        renderedDay = getRenderedDay(tomorrow);
        dateDisabled = datepicker.isDateDisabled(renderedDay);
        expect(dateDisabled).toBeFalsy();
      });
    });

    it('should enable future dates + today when direction is 2', () => {
      let date = new Date(2017, 7, 2);
      // Build the rendered date
      let renderedDay = getRenderedDay(date);
      testComponent.dateDirection = 2;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        let dateDisabled = datepicker.isDateDisabled(renderedDay);
        expect(dateDisabled).toBeTruthy();
        date = new Date();
        date.setHours(0, 0, 0);
        renderedDay = getRenderedDay(date);
        dateDisabled = datepicker.isDateDisabled(renderedDay);
        expect(dateDisabled).toBeFalsy();

        const tomorrow = new Date();
        tomorrow.setDate(date.getDate() + 1);
        tomorrow.setHours(0, 0, 0);
        renderedDay = getRenderedDay(tomorrow);
        dateDisabled = datepicker.isDateDisabled(renderedDay);
        expect(dateDisabled).toBeFalsy();
      });
    });

    it('should only enable past dates when direction is -1', () => {
      let date = new Date(2017, 7, 2);
      // Build the rendered date
      let renderedDay = getRenderedDay(date);
      testComponent.dateDirection = -1;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        let dateDisabled = datepicker.isDateDisabled(renderedDay);
        expect(dateDisabled).toBeFalsy();

        date = new Date();
        date.setHours(0, 0, 0);
        renderedDay = getRenderedDay(date);
        dateDisabled = datepicker.isDateDisabled(renderedDay);
        expect(dateDisabled).toBeTruthy();

        const tomorrow = new Date();
        tomorrow.setDate(date.getDate() + 1);
        tomorrow.setHours(0, 0, 0);
        renderedDay = getRenderedDay(tomorrow);
        dateDisabled = datepicker.isDateDisabled(renderedDay);
        expect(dateDisabled).toBeTruthy();
      });
    });


    it('should enable past dates + today when direction is -2', () => {
      let date = new Date(2017, 7, 2);
      // Build the rendered date
      let renderedDay = getRenderedDay(date);
      testComponent.dateDirection = -2;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        let dateDisabled = datepicker.isDateDisabled(renderedDay);
        expect(dateDisabled).toBeFalsy();

        date = new Date();
        date.setHours(0, 0, 0);
        renderedDay = getRenderedDay(date);
        dateDisabled = datepicker.isDateDisabled(renderedDay);
        expect(dateDisabled).toBeFalsy();

        const tomorrow = new Date();
        tomorrow.setDate(date.getDate() + 1);
        tomorrow.setHours(0, 0, 0);
        renderedDay = getRenderedDay(tomorrow);
        dateDisabled = datepicker.isDateDisabled(renderedDay);
        expect(dateDisabled).toBeTruthy();
      });
    });

    it('should disable weekends when disableWeekends is true', () => {
      let date = new Date(2017, 7, 12);
      // Build the rendered date
      let renderedDay = getRenderedDay(date);
      testComponent.isWeekendDisabled = true;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        let dateDisabled = datepicker.isDateDisabled(renderedDay);
        expect(dateDisabled).toBeTruthy();
        date = new Date(2017, 7, 14);
        renderedDay = getRenderedDay(date);
        dateDisabled = datepicker.isDateDisabled(renderedDay);
        expect(dateDisabled).toBeFalsy();
      });
    });

    it('should disable dates based on disabledDates regex', () => {
      let date = new Date(2017, 3, 10);
      // Build the rendered date
      let renderedDay = getRenderedDay(date);
      testComponent.disabledDatesArr = ['2017 3,5 5-12 1'];
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        let dateDisabled = datepicker.isDateDisabled(renderedDay);
        expect(dateDisabled).toBeTruthy();

        date = new Date(2017, 7, 15);
        date.setHours(0, 0, 0);
        renderedDay = getRenderedDay(date);
        dateDisabled = datepicker.isDateDisabled(renderedDay);
        expect(dateDisabled).toBeFalsy();
      });
    });

    it('should disable dates based on disabledDates array', () => {
      let date = new Date(2017, 7, 12);
      // Build the rendered date
      let renderedDay = getRenderedDay(date);
      testComponent.disabledDatesArr = [new Date()];
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        let dateDisabled = datepicker.isDateDisabled(renderedDay);
        expect(dateDisabled).toBeFalsy();

        date = new Date();
        date.setHours(0, 0, 0);
        renderedDay = getRenderedDay(date);
        dateDisabled = datepicker.isDateDisabled(renderedDay);
        expect(dateDisabled).toBeTruthy();
      });
    });

    it('should set given date as selected date when _onDaySelected is called', () => {
      const date = new Date(2017, 7, 12);
      date.setHours(0, 0, 0);
      datepicker.hideOnSelect = true;
      const formattedDate = datepicker.formatDate(date);
      // Build the rendered date
      const renderedDay = getRenderedDay(date);
      datepicker._onDaySelected(renderedDay);
      fixture.detectChanges();
      expect(datepicker.selectedDate.getTime()).toBe(date.getTime());
      expect(datepickerInputElement.value).toBe(formattedDate);
      expect(datepicker.active).toBeFalsy();
      expect(datepicker.calendarFocused).toBeFalsy();
    });
  });
});

@Component({
  selector: 'datepicker-test-app',
  template: `
    <is-datepicker [(ngModel)]="datepickerData"
                   [alwaysVisible]="isAlwaysVisible"
                   [showToday]="showTodayBtn"
                   [direction]="dateDirection"
                   [disableWeekends]="isWeekendDisabled"
                   [disabledDates]="disabledDatesArr"
                   [hideOnSelect]="hideOnSelect"
                   (onDateSelected)="onDateSelected"
                   [placeholder]="placeholder"
                   [placement]="dpPlacement"
                   [formatStr]="formatString">
    </is-datepicker>`
})
class DatepickerTestApp {
  datepickerData: Date;
  dpPlacement: string;
  isAlwaysVisible: boolean;
  hideOnSelect: boolean;
  showTodayBtn: boolean;
  isWeekendDisabled: boolean;
  disabledDatesArr = [];
  placeholder: string;
  dateDirection = 0;
  formatString: string;

  onDateSelected(date: Date) {
  }
}
