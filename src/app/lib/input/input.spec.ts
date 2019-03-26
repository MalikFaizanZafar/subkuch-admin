import { Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators
} from '@angular/forms';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { PlatformModule } from '@angular/cdk/platform';
import { IsInput, IsInputModule, IsNativeInputDirective } from './index';
import { getContainerMissingInputErrorMessage } from './input.errors';

function dispatchFakeEvent(node: Node | Window, type: string): Event {
  const event = document.createEvent('Event');
  event.initEvent(type, true, true);
  node.dispatchEvent(event);
  return event;
}

describe('InputContainer', function() {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          IsInputModule,
          FormsModule,
          ReactiveFormsModule,
          PlatformModule
        ],
        declarations: [
          InputContainerBaseTestController,
          InputContainerDateTestController,
          InputContainerInvalidTypeTestController,
          InputContainerNumberTestController,
          InputContainerPasswordTestController,
          InputContainerPlaceholderAttrTestComponent,
          InputContainerTextTestController,
          InputContainerWithDisabled,
          InputContainerWithFormControl,
          InputContainerWithFormErrorMessages,
          InputContainerWithFormGroupErrorMessages,
          InputContainerWithId,
          InputContainerWithRequired,
          InputContainerWithStaticPlaceholder,
          InputContainerWithValueBinding,
          InputContainerZeroTestController,
          InputContainerWithNgIf,
          InputTestApp,
          TextareaWithBindings,
          InputContainerMissingInputTestController
        ],
        providers: [
          BreakpointObserver,
          MediaMatcher
        ]
      });

      TestBed.compileComponents();
    })
  );

  it('should treat text input type as empty at init', () => {
    const fixture = TestBed.createComponent(InputContainerTextTestController);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.directive(IsInput)).nativeElement;
    expect(el).not.toBeNull();
    expect(el.classList.contains('is-input-container--empty')).toBe(true);
  });

  it('should treat password input type as empty at init', () => {
    const fixture = TestBed.createComponent(InputContainerPasswordTestController);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.directive(IsInput)).nativeElement;
    expect(el).not.toBeNull();
    expect(el.classList.contains('is-input-container--empty')).toBe(true);
  });

  it('should treat number input type as empty at init', () => {
    const fixture = TestBed.createComponent(InputContainerNumberTestController);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.directive(IsInput)).nativeElement;
    expect(el).not.toBeNull();
    expect(el.classList.contains('is-input-container--empty')).toBe(true);
  });

  it(
    'should not be empty after input entered',
    async(() => {
      const fixture = TestBed.createComponent(InputContainerTextTestController);
      fixture.detectChanges();

      const inputEl = fixture.debugElement.query(By.css('input'));
      let el = fixture.debugElement.query(By.directive(IsInput)).nativeElement;
      expect(el).not.toBeNull();
      expect(el.classList.contains('is-input-container--empty')).toBe(
        true,
        'should be empty'
      );

      inputEl.nativeElement.value = 'hello';
      // Simulate input event.
      inputEl.triggerEventHandler('input', { target: inputEl.nativeElement });
      fixture.detectChanges();

      el = fixture.debugElement.query(By.directive(IsInput)).nativeElement;
      expect(el.classList.contains('is-input-container--empty')).toBe(
        false,
        'should not be empty'
      );
    })
  );

  it(
    'should update the placeholder when input entered',
    async(() => {
      const fixture = TestBed.createComponent(
        InputContainerWithStaticPlaceholder
      );
      fixture.detectChanges();

      const inputEl = fixture.debugElement.query(By.css('input'));
      const containerEl = fixture.debugElement.query(By.directive(IsInput))
        .nativeElement;

      expect(containerEl.classList).toContain('is-input-container--empty');

      // Update the value of the input.
      inputEl.nativeElement.value = 'Text';

      // Fake behavior of the `(input)` event which should trigger a change detection.
      fixture.detectChanges();

      expect(containerEl.classList).not.toContain('is-input-container--empty');
    })
  );

  it(
    'should not treat the number 0 as empty',
    async(() => {
      const fixture = TestBed.createComponent(InputContainerZeroTestController);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const el = fixture.debugElement.query(By.directive(IsInput))
          .nativeElement;
        expect(el).not.toBeNull();
        expect(el.classList.contains('is-input-container--empty')).toBe(false);
      });
    })
  );

  it('should update the value when using FormControl.setValue', () => {
    const fixture = TestBed.createComponent(InputContainerWithFormControl);
    fixture.detectChanges();

    const input = fixture.debugElement
      .query(By.directive(IsNativeInputDirective))
      .injector.get<IsNativeInputDirective>(IsNativeInputDirective);

    expect(input.value).toBeFalsy();

    fixture.componentInstance.formControl.setValue('something');

    expect(input.value).toBe('something');
  });

  it('should add id', () => {
    const fixture = TestBed.createComponent(InputContainerTextTestController);
    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;
    const labelElement: HTMLInputElement = fixture.debugElement.query(
      By.css('label')
    ).nativeElement;

    expect(inputElement.id).toBeTruthy();
    expect(inputElement.id).toEqual(labelElement.getAttribute('for'));
  });

  it('should not overwrite existing id', () => {
    const fixture = TestBed.createComponent(InputContainerWithId);
    fixture.detectChanges();
    const inputElement: HTMLInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;
    const labelElement: HTMLInputElement = fixture.debugElement.query(
      By.css('label')
    ).nativeElement;

    expect(inputElement.id).toBe('test-id');
    expect(labelElement.getAttribute('for')).toBe('test-id');
  });

  it('validates that input child is present', () => {
    const fixture = TestBed.createComponent(
      InputContainerMissingInputTestController
    );

    expect(() => fixture.detectChanges()).toThrowError(
      getContainerMissingInputErrorMessage()
    );
  });

  it(
    'validates that input child is present after initialization',
    async(() => {
      const fixture = TestBed.createComponent(InputContainerWithNgIf);

      expect(() => fixture.detectChanges()).not.toThrowError(
        getContainerMissingInputErrorMessage()
      );

      fixture.componentInstance.renderInput = false;

      expect(() => fixture.detectChanges()).toThrowError(
        getContainerMissingInputErrorMessage()
      );
    })
  );

  it('validates the type', () => {
    const fixture = TestBed.createComponent(
      InputContainerInvalidTypeTestController
    );

    // Technically this throws during the OnChanges detection phase,
    // so the error is really a ChangeDetectionError and it becomes
    // hard to build a full exception to compare with.
    // We just check for any exception in this case.
    expect(() => fixture.detectChanges())
      .toThrow
      /* new InputContainerUnsupportedTypeError('file') */
      ();
  });

  it(
    'supports placeholder attribute',
    async(() => {
      const fixture = TestBed.createComponent(
        InputContainerPlaceholderAttrTestComponent
      );
      fixture.detectChanges();

      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

      expect(inputEl.placeholder).toBe('');

      fixture.componentInstance.placeholder = 'Other placeholder';
      fixture.detectChanges();

      expect(inputEl.placeholder).toBe('Other placeholder');
    })
  );

  it(
    'supports the disabled attribute as binding',
    async(() => {
      const fixture = TestBed.createComponent(InputContainerWithDisabled);
      fixture.detectChanges();

      const containerEl = fixture.debugElement.query(By.directive(IsInput))
        .nativeElement;
      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

      expect(
        containerEl.classList.contains('is-input-container--disabled')
      ).toBe(false, `Expected container not to start out disabled.`);
      expect(inputEl.disabled).toBe(false);

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      expect(
        containerEl.classList.contains('is-input-container--disabled')
      ).toBe(
        true,
        `Expected container to look disabled after property is set.`
      );
      expect(inputEl.disabled).toBe(true);
    })
  );

  it('should display disabled styles when using FormControl.disable()', () => {
    const fixture = TestBed.createComponent(InputContainerWithFormControl);
    fixture.detectChanges();
    const containerEl = fixture.debugElement.query(By.directive(IsInput))
      .nativeElement;
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(containerEl.classList).not.toContain(
      'is-input-container--disabled',
      `Expected container not to start out disabled.`
    );
    expect(inputEl.disabled).toBe(false);

    fixture.componentInstance.formControl.disable();
    fixture.detectChanges();

    expect(containerEl.classList).toContain(
      'is-input-container--disabled',
      `Expected container to look disabled after disable() is called.`
    );
    expect(inputEl.disabled).toBe(true);
  });

  it(
    'supports the required attribute as binding',
    async(() => {
      const fixture = TestBed.createComponent(InputContainerWithRequired);
      fixture.detectChanges();

      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

      expect(inputEl.required).toBe(false);

      fixture.componentInstance.required = true;
      fixture.detectChanges();

      expect(inputEl.required).toBe(true);
    })
  );

  it('supports textarea', () => {
    const fixture = TestBed.createComponent(TextareaWithBindings);
    fixture.detectChanges();

    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector(
      'textarea'
    );
    expect(textarea).not.toBeNull();
  });

  describe('error messages', () => {
    let fixture: ComponentFixture<InputContainerWithFormErrorMessages>;
    let testComponent: InputContainerWithFormErrorMessages;
    let containerEl: HTMLElement;
    let inputEl: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(InputContainerWithFormErrorMessages);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      containerEl = fixture.debugElement.query(By.css('is-input-container'))
        .nativeElement;
      inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should not show any errors if the user has not interacted', () => {
      expect(testComponent.formControl.untouched).toBe(
        true,
        'Expected untouched form control'
      );
      expect(
        containerEl.querySelectorAll('.is-input__error-message').length
      ).toBe(0, 'Expected no error messages');
      expect(inputEl.getAttribute('aria-invalid')).toBe(
        'false',
        'Expected aria-invalid to be set to "false".'
      );
    });

    it(
      'should display an error message when the input is touched and invalid',
      async(() => {
        expect(testComponent.formControl.invalid).toBe(
          true,
          'Expected form control to be invalid'
        );
        expect(
          containerEl.querySelectorAll('.is-input__error-message').length
        ).toBe(0, 'Expected no error messages');

        testComponent.formControl.markAsTouched();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(containerEl.classList).toContain(
            'is-input-container--invalid',
            'Expected container to have the invalid CSS class.'
          );
          expect(
            containerEl.querySelectorAll('.is-input__error-message').length
          ).toBe(1, 'Expected one error message to have been rendered.');
          expect(inputEl.getAttribute('aria-invalid')).toBe(
            'true',
            'Expected aria-invalid to be set to "true".'
          );
        });
      })
    );

    it(
      'should display an error message when the parent form is submitted',
      async(() => {
        expect(testComponent.form.submitted).toBe(
          false,
          'Expected form not to have been submitted'
        );
        expect(testComponent.formControl.invalid).toBe(
          true,
          'Expected form control to be invalid'
        );
        expect(
          containerEl.querySelectorAll('.is-input__error-message').length
        ).toBe(0, 'Expected no error messages');

        dispatchFakeEvent(
          fixture.debugElement.query(By.css('form')).nativeElement,
          'submit'
        );
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(testComponent.form.submitted).toBe(
            true,
            'Expected form to have been submitted'
          );
          expect(containerEl.classList).toContain(
            'is-input-container--invalid',
            'Expected container to have the invalid CSS class.'
          );
          expect(
            containerEl.querySelectorAll('.is-input__error-message').length
          ).toBe(1, 'Expected one error message to have been rendered.');
          expect(inputEl.getAttribute('aria-invalid')).toBe(
            'true',
            'Expected aria-invalid to be set to "true".'
          );
        });
      })
    );

    it(
      'should display an error message when the parent form group is submitted',
      async(() => {
        fixture.destroy();

        const groupFixture = TestBed.createComponent(
          InputContainerWithFormGroupErrorMessages
        );
        let component: InputContainerWithFormGroupErrorMessages;

        groupFixture.detectChanges();
        component = groupFixture.componentInstance;
        containerEl = groupFixture.debugElement.query(
          By.css('is-input-container')
        ).nativeElement;
        inputEl = groupFixture.debugElement.query(By.css('input'))
          .nativeElement;

        expect(component.formGroup.invalid).toBe(
          true,
          'Expected form control to be invalid'
        );
        expect(
          containerEl.querySelectorAll('.is-input__error-message').length
        ).toBe(0, 'Expected no error messages');
        expect(inputEl.getAttribute('aria-invalid')).toBe(
          'false',
          'Expected aria-invalid to be set to "false".'
        );
        expect(component.formGroupDirective.submitted).toBe(
          false,
          'Expected form not to have been submitted'
        );

        dispatchFakeEvent(
          groupFixture.debugElement.query(By.css('form')).nativeElement,
          'submit'
        );
        groupFixture.detectChanges();

        groupFixture.whenStable().then(() => {
          expect(component.formGroupDirective.submitted).toBe(
            true,
            'Expected form to have been submitted'
          );
          expect(containerEl.classList).toContain(
            'is-input-container--invalid',
            'Expected container to have the invalid CSS class.'
          );
          expect(
            containerEl.querySelectorAll('.is-input__error-message').length
          ).toBe(1, 'Expected one error message to have been rendered.');
          expect(inputEl.getAttribute('aria-invalid')).toBe(
            'true',
            'Expected aria-invalid to be set to "true".'
          );
        });
      })
    );

    it(
      'should hide the errors and show the hints once the input becomes valid',
      async(() => {
        testComponent.formControl.markAsTouched();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(containerEl.classList).toContain(
            'is-input-container--invalid',
            'Expected container to have the invalid CSS class.'
          );
          expect(
            containerEl.querySelectorAll('.is-input__error-message').length
          ).toBe(1, 'Expected one error message to have been rendered.');

          testComponent.formControl.setValue('something');
          fixture.detectChanges();

          fixture.whenStable().then(() => {
            expect(containerEl.classList).not.toContain(
              'is-input-container--invalid',
              'Expected container not to have the invalid class when valid.'
            );
            expect(
              containerEl.querySelectorAll('.is-input__error-message').length
            ).toBe(0, 'Expected no error messages when the input is valid.');
          });
        });
      })
    );
  });
});

@Component({
  template: `
    <is-input-container label="test">
      <input type="text" id="test-id">
    </is-input-container>`
})
class InputContainerWithId {}

@Component({
  template: `<is-input-container><input type="text" [disabled]="disabled"></is-input-container>`
})
class InputContainerWithDisabled {
  disabled: boolean;
}

@Component({
  template: `<is-input-container><input type="text" [required]="required"></is-input-container>`
})
class InputContainerWithRequired {
  required: boolean;
}

@Component({
  template: `<is-input-container><input type="text" [formControl]="formControl"></is-input-container>`
})
class InputContainerWithFormControl {
  formControl = new FormControl();
}

@Component({
  template: `<is-input-container><input type="text" [placeholder]="placeholder"></is-input-container>`
})
class InputContainerPlaceholderAttrTestComponent {
  placeholder = '';
}

@Component({
  template: `<is-input-container><input type="file"></is-input-container>`
})
class InputContainerInvalidTypeTestController {}

@Component({
  template: `<is-input-container><input type="text" [(ngModel)]="model"></is-input-container>`
})
class InputContainerBaseTestController {
  model: any = '';
}

@Component({
  template: `
    <is-input-container>
      <input type="date" placeholder="Placeholder">
    </is-input-container>`
})
class InputContainerDateTestController {}

@Component({
  template: `
    <is-input-container label="label">
      <input type="text" placeholder="Placeholder">
    </is-input-container>`
})
class InputContainerTextTestController {}

@Component({
  template: `
    <is-input-container>
      <input type="password" placeholder="Placeholder">
    </is-input-container>`
})
class InputContainerPasswordTestController {}

@Component({
  template: `
    <is-input-container>
      <input type="number" placeholder="Placeholder">
    </is-input-container>`
})
class InputContainerNumberTestController {}

@Component({
  template: `
    <is-input-container>
      <input type="number" placeholder="Placeholder" [(ngModel)]="value">
    </is-input-container>`
})
class InputContainerZeroTestController {
  value = 0;
}

@Component({
  template: `
    <is-input-container>
      <input type="text" placeholder="Label" [value]="value">
    </is-input-container>`
})
class InputContainerWithValueBinding {
  value = 'Initial';
}

@Component({
  template: `
    <is-input-container >
      <input type="text" placeholder="Label">
    </is-input-container>
  `
})
class InputContainerWithStaticPlaceholder {}

@Component({
  template: `
    <is-input-container>
      <textarea [rows]="rows" [cols]="cols" [wrap]="wrap" placeholder="Snacks"></textarea>
    </is-input-container>`
})
class TextareaWithBindings {
  rows = 4;
  cols = 8;
  wrap = 'hard';
}

@Component({
  template: `<is-input-container><input type="button"></is-input-container>`
})
class InputContainerMissingInputTestController {}

@Component({
  template: `
    <form #form="ngForm" novalidate>
      <is-input-container errorMessage="This field is required">
        <input type="text" [formControl]="formControl">
      </is-input-container>
    </form>
  `
})
class InputContainerWithFormErrorMessages {
  @ViewChild('form') form: NgForm;
  formControl = new FormControl('', Validators.required);
  renderError = true;
}

@Component({
  template: `
    <form [formGroup]="formGroup" novalidate>
      <is-input-container errorMessage="This field is required">
        <input type="text" formControlName="name">
      </is-input-container>
    </form>
  `
})
class InputContainerWithFormGroupErrorMessages {
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  formGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  });
}

@Component({
  template: `
    <is-input-container>
      <input type="text" *ngIf="renderInput">
    </is-input-container>
  `
})
class InputContainerWithNgIf {
  renderInput = true;
}

@Component({
  selector: 'input-test-app',
  template: `
    <is-input-container [label]="inputLabel"
                            [tooltip]="inputTooltip"
                            [tooltipPosition]="inputTooltipPosition"
                            [tooltipClassName]="theme"
                            [tooltipTemplate]="tooltipTemplateRef"
                            [tooltipData]="{title: 'Custom Tooltip'}">
          <input type="text"
                 *ngIf="!textarea"
                 [(ngModel)]="inputModel"
                 [name]="inputName"
                 [id]="inputId"
                 [disabled]="isDisabled"
                 [placeholder]="placeholder"
                 (change)="onInputChanged($event)">
        </is-input-container>`
})
class InputTestApp {
  isDisabled = false;
  inputModel = '';
  slideChecked = false;
  placeholder: string;
  inputId: string;
  inputName: string;
  inputLabel: string;
  inputTooltip: string;
  inputTooltipPosition: string;
  inputTooltipClassName: string;
  inputTooltipData: object;
  lastEvent: Event;
  onInputChanged(event) {
    this.lastEvent = event;
  }
}
