import {
  async,
  fakeAsync,
  flushMicrotasks,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { NgModel, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Component, DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { IsCheckbox } from './checkbox';
import { IsCheckboxChange } from './checkbox.models';

describe('IsCheckbox', () => {
  let fixture: ComponentFixture<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        IsCheckbox,
        SingleCheckbox,
        CheckboxWithFormDirectives,
        CheckboxWithTabIndex,
        CheckboxWithAriaLabel,
        CheckboxWithAriaLabelledby,
        CheckboxWithNameAttribute,
        CheckboxWithChangeEvent,
        CheckboxWithFormControl
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    TestBed.compileComponents();
  }));

  describe('basic behaviors', () => {
    let testComponent: SingleCheckbox;
    let checkbox: IsCheckbox;
    let checkboxElement: HTMLElement;
    let inputElement: HTMLInputElement;
    let labelElement: HTMLSpanElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(SingleCheckbox);
      testComponent = fixture.debugElement.componentInstance;
      // Initialize the slide-toggle component, by triggering the first change detection cycle.
      fixture.detectChanges();

      const checkboxDebug = fixture.debugElement.query(
        By.directive(IsCheckbox)
      );

      checkbox = checkboxDebug.componentInstance;
      checkboxElement = checkboxDebug.nativeElement;
      inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      labelElement = fixture.debugElement.query(By.css('.is-checkbox__label')).nativeElement;
    });

    it('should add and remove the checked state', async(() => {
      expect(checkbox.checked).toBe(false);
      expect(inputElement.checked).toBe(false);

      testComponent.isChecked = true;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(checkbox.checked).toBe(true);
        expect(checkbox.currentIcon).toBe('fa fa-check-square');
        expect(inputElement.checked).toBe(true);

        testComponent.isChecked = false;
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(checkbox.checked).toBe(false);
          expect(checkbox.currentIcon).toContain('fa fa-square-o');
          expect(inputElement.checked).toBe(false);
        });
      });
    }));

    it('should add and remove indeterminate state', async(() => {
      expect(checkbox.currentIcon).not.toEqual('fa fa-check-square');
      expect(inputElement.checked).toBe(false);

      testComponent.isIndeterminate = true;
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(checkbox.currentIcon).toEqual('fa fa-minus-square');
        expect(inputElement.checked).toBe(false);

        testComponent.isIndeterminate = false;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(checkbox.currentIcon).not.toEqual('fa fa-minus-square');
          expect(inputElement.checked).toBe(false);
        });
      });
    }));

    it('should change native element checked when check programmatically', () => {
      expect(inputElement.checked).toBe(false);

      checkbox.checked = true;
      fixture.detectChanges();

      expect(inputElement.checked).toBe(true);
    });

    it('should add and remove disabled state', () => {
      expect(checkbox.disabled).toBe(false);
      expect(checkboxElement.classList).not.toContain('is-checkbox__icon--disabled');
      expect(inputElement.tabIndex).toBe(0);
      expect(inputElement.disabled).toBe(false);

      testComponent.isDisabled = true;
      fixture.detectChanges();

      expect(checkbox.disabled).toBe(true);
      expect(checkboxElement.classList).toContain('is-checkbox__icon--disabled');
      expect(inputElement.disabled).toBe(true);

      testComponent.isDisabled = false;
      fixture.detectChanges();

      expect(checkbox.disabled).toBe(false);
      expect(checkboxElement.classList).not.toContain('is-checkbox__icon--disabled');
      expect(inputElement.tabIndex).toBe(0);
      expect(inputElement.disabled).toBe(false);
    });

    it('should not toggle `checked` state upon interation while disabled', () => {
      testComponent.isDisabled = true;
      fixture.detectChanges();

      checkboxElement.click();
      expect(checkbox.checked).toBe(false);
    });

    it('should overwrite indeterminate state when clicked', fakeAsync(() => {
      testComponent.isIndeterminate = true;
      fixture.detectChanges();

      inputElement.click();
      fixture.detectChanges();

      // Flush the microtasks because the indeterminate state will be updated in the next tick.
      flushMicrotasks();

      expect(checkbox.checked).toBe(true);
      expect(checkbox.indeterminate).toBe(false);
    }));

    it('should preserve the user-provided id', () => {
      expect(checkbox.id).toBe('simple-check');
      expect(inputElement.id).toBe('simple-check');
    });

    it('should generate a unique id for the checkbox input if no id is set', () => {
      testComponent.checkboxId = null;
      fixture.detectChanges();

      expect(checkbox.inputId).toMatch(/is-checkbox-\d+/);
      expect(inputElement.id).toBe(checkbox.inputId);
    });

    it('should make the host element a tab stop', () => {
      expect(inputElement.tabIndex).toBe(0);
    });

    it('should add a css class to position the label before the checkbox', () => {
      testComponent.labelPos = 'before';
      fixture.detectChanges();

      expect(checkboxElement.classList).toContain('is-checkbox--label-before');
    });

    it('should forward the required attribute', () => {
      expect(inputElement.required).toBe(false);
      testComponent.isRequired = true;
      fixture.detectChanges();

      expect(inputElement.required).toBe(true);

      testComponent.isRequired = false;
      fixture.detectChanges();

      expect(inputElement.required).toBe(false);
    });

    it('should trigger a change event when the native input does', async(() => {
      spyOn(testComponent, 'onCheckboxChange');

      expect(inputElement.checked).toBe(false);
      expect(checkboxElement.classList).not.toContain('is-checkbox__icon--checked');

      labelElement.click();
      fixture.detectChanges();

      expect(inputElement.checked).toBe(true);
      expect(checkboxElement.classList).toContain('is-checkbox__icon--checked');

      fixture.whenStable().then(() => {
        expect(testComponent.onCheckboxChange).toHaveBeenCalledTimes(1);
      });
    }));

    describe('color behaviour', () => {
      it('should apply class based on color attribute', async(() => {
        testComponent.isChecked = true;
        testComponent.cbCheckedColor = 'aqua';
        testComponent.cbLabelColor = 'green';
        testComponent.cbUncheckedColor = 'blue';
        testComponent.cbIndeterminateColor = 'red';

        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(checkbox.checked).toBe(true);
          expect(checkbox.currentIconColor).toBe('aqua');
          expect(labelElement.style.color).toEqual('green');
          expect(inputElement.checked).toBe(true);

          testComponent.isChecked = false;
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();

            expect(checkbox.checked).toBe(false);
            expect(inputElement.checked).toBe(false);

            testComponent.isIndeterminate = true;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              fixture.detectChanges();
              expect(checkbox.indeterminate).toBe(true);
            });
          });
        });
      }));
    });

    describe('icon behaviour', () => {
      it('should apply class based on icon attribute', async(() => {
        testComponent.isChecked = true;
        fixture.detectChanges();

        testComponent.cbCheckedIcon = 'fa fa-calendar-check-o';
        testComponent.cbUncheckedIcon = 'fa fa-calendar-o';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(checkbox.checked).toBe(true);
          expect(checkbox.currentIcon).toBe('fa fa-calendar-check-o');
          expect(inputElement.checked).toBe(true);

          testComponent.isChecked = false;
          fixture.detectChanges();

          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(checkbox.checked).toBe(false);
            expect(checkbox.currentIcon).toBe('fa fa-calendar-o');
          });
        });
      }));
    });

  });

  describe('with ngModel', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let checkbox: IsCheckbox;
    let inputElement: HTMLInputElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(CheckboxWithFormDirectives);
      fixture.detectChanges();

      checkboxDebugElement = fixture.debugElement.query(By.directive(IsCheckbox));
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      checkbox = checkboxDebugElement.componentInstance;
      inputElement = <HTMLInputElement> checkboxNativeElement.querySelector('input');
    });

    it('should be in pristine, untouched, and valid states initially', fakeAsync(() => {
      flushMicrotasks();

      const checkboxElement = fixture.debugElement.query(By.directive(IsCheckbox));
      const ngModel = checkboxElement.injector.get<NgModel>(NgModel);

      expect(ngModel.valid).toBe(true);
      expect(ngModel.pristine).toBe(true);
    }));

    it('should toggle checked state on click', () => {
      expect(checkbox.checked).toBe(false);

      inputElement.click();
      fixture.detectChanges();

      expect(checkbox.checked).toBe(true);

      inputElement.click();
      fixture.detectChanges();

      expect(checkbox.checked).toBe(false);
    });
  });

  describe('with form control', () => {
    let checkboxDebugElement: DebugElement;
    let checkbox: IsCheckbox;
    let testComponent: CheckboxWithFormControl;
    let inputElement: HTMLInputElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(CheckboxWithFormControl);
      fixture.detectChanges();

      checkboxDebugElement = fixture.debugElement.query(By.directive(IsCheckbox));
      checkbox = checkboxDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;
      inputElement = <HTMLInputElement> checkboxDebugElement.nativeElement.querySelector('input');
    });

    it('should toggle the disabled state', () => {
      expect(checkbox.disabled).toBe(false);

      testComponent.formControl.disable();
      fixture.detectChanges();

      expect(checkbox.disabled).toBe(true);
      expect(inputElement.disabled).toBe(true);

      testComponent.formControl.enable();
      fixture.detectChanges();

      expect(checkbox.disabled).toBe(false);
      expect(inputElement.disabled).toBe(false);
    });
  });

  describe('with name attribute', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(CheckboxWithNameAttribute);
      fixture.detectChanges();
    });

    it('should forward name value to input element', () => {
      const checkboxElement = fixture.debugElement.query(By.directive(IsCheckbox));
      const inputElement = <HTMLInputElement> checkboxElement.nativeElement.querySelector('input');

      expect(inputElement.getAttribute('name')).toBe('test-name');
    });
  });

  describe('with provided aria-label ', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let inputElement: HTMLInputElement;

    it('should use the provided aria-label', () => {
      fixture = TestBed.createComponent(CheckboxWithAriaLabel);
      checkboxDebugElement = fixture.debugElement.query(By.directive(IsCheckbox));
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      inputElement = <HTMLInputElement> checkboxNativeElement.querySelector('input');

      fixture.detectChanges();
      expect(inputElement.getAttribute('aria-label')).toBe('Super effective');
    });
  });

  describe('with provided aria-labelledby ', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let inputElement: HTMLInputElement;

    it('should use the provided aria-labelledby', () => {
      fixture = TestBed.createComponent(CheckboxWithAriaLabelledby);
      checkboxDebugElement = fixture.debugElement.query(By.directive(IsCheckbox));
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      inputElement = <HTMLInputElement> checkboxNativeElement.querySelector('input');

      fixture.detectChanges();
      expect(inputElement.getAttribute('aria-labelledby')).toBe('some-id');
    });

    it('should not assign aria-labelledby if none is provided', () => {
      fixture = TestBed.createComponent(SingleCheckbox);
      checkboxDebugElement = fixture.debugElement.query(By.directive(IsCheckbox));
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      inputElement = <HTMLInputElement> checkboxNativeElement.querySelector('input');

      fixture.detectChanges();
      expect(inputElement.getAttribute('aria-labelledby')).toBe(null);
    });
  });

  describe('with provided tabIndex', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let testComponent: CheckboxWithTabIndex;
    let inputElement: HTMLInputElement;
    let labelElement: HTMLLabelElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(CheckboxWithTabIndex);
      fixture.detectChanges();

      testComponent = fixture.debugElement.componentInstance;
      checkboxDebugElement = fixture.debugElement.query(By.directive(IsCheckbox));
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      inputElement = <HTMLInputElement> checkboxNativeElement.querySelector('input');
      labelElement = <HTMLLabelElement> checkboxNativeElement.querySelector('label');
    });

    it('should preserve any given tabIndex', () => {
      expect(inputElement.tabIndex).toBe(7);
    });

    it('should preserve given tabIndex when the checkbox is disabled then enabled', () => {
      testComponent.isDisabled = true;
      fixture.detectChanges();

      testComponent.customTabIndex = 13;
      fixture.detectChanges();

      testComponent.isDisabled = false;
      fixture.detectChanges();

      expect(inputElement.tabIndex).toBe(13);
    });

  });

});

/** Simple component for testing a single checkbox. */
@Component({
  template: `
    <is-checkbox
      [id]="checkboxId"
      [required]="isRequired"
      [labelPosition]="labelPos"
      [checked]="isChecked"
      [(indeterminate)]="isIndeterminate"
      [disabled]="isDisabled"
      [color]="checkboxColor"
      [disableRipple]="disableRipple"
      [value]="checkboxValue"
      [labelColor]="cbLabelColor"
      [checkedColor]="cbCheckedColor"
      [uncheckedColor]="cbUncheckedColor"
      [indeterminateColor]="cbIndeterminateColor"
      [checkedIcon]="cbCheckedIcon"
      [uncheckedIcon]="cbUncheckedIcon"
      [indeterminateIcon]="cbIndeterminateIcon"
      (change)="onCheckboxChange($event)">
      Simple checkbox
    </is-checkbox>`
})
class SingleCheckbox {
  labelPos: 'before' | 'after' = 'after';
  isChecked = false;
  isRequired = false;
  isIndeterminate = false;
  isDisabled = false;
  disableRipple = false;
  checkboxId: string | null = 'simple-check';
  checkboxColor = 'primary';
  checkboxValue = 'single_checkbox';
  cbCheckedColor: string;
  cbUncheckedColor: string;
  cbLabelColor: string;
  cbIndeterminateColor: string;
  cbCheckedIcon: string;
  cbUncheckedIcon: string;
  cbIndeterminateIcon: string;

  onCheckboxChange: (event?: IsCheckboxChange) => void = () => {
  }
}

/** Simple component for testing an IsCheckbox with ngModel. */
@Component({
  template: `
    <form>
      <is-checkbox name="cb" [(ngModel)]="isGood">Be good</is-checkbox>
    </form>
  `,
})
class CheckboxWithFormDirectives {
  isGood = false;
}

/** Simple test component with tabIndex */
@Component({
  template: `
    <is-checkbox
      [tabIndex]="customTabIndex"
      [disabled]="isDisabled">
    </is-checkbox>`,
})
class CheckboxWithTabIndex {
  customTabIndex = 7;
  isDisabled = false;
}

/** Simple test component with an aria-label set. */
@Component({
  template: `
    <is-checkbox aria-label="Super effective"></is-checkbox>`
})
class CheckboxWithAriaLabel {
}

/** Simple test component with an aria-label set. */
@Component({
  template: `
    <is-checkbox aria-labelledby="some-id"></is-checkbox>`
})
class CheckboxWithAriaLabelledby {
}

/** Simple test component with name attribute */
@Component({
  template: `
    <is-checkbox name="test-name"></is-checkbox>`
})
class CheckboxWithNameAttribute {
}

/** Simple test component with change event */
@Component({
  template: `
    <is-checkbox (change)="lastEvent = $event"></is-checkbox>`
})
class CheckboxWithChangeEvent {
  lastEvent: IsCheckboxChange;
}

/** Test component with reactive forms */
@Component({
  template: `
    <is-checkbox [formControl]="formControl"></is-checkbox>`
})
class CheckboxWithFormControl {
  formControl = new FormControl();
}
