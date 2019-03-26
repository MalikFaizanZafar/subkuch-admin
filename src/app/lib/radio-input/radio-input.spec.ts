import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { IsRadioGroup, IsRadioInput } from './radio-input';
import { IsRadioInputLabelPosition } from './radio-input-label-position';
import { IsRadioInputModule } from './radio-input.module';
import { IsRadioInputService } from './radio-input.service';

describe('IsRadioInput', () => {
  let fixture: ComponentFixture<any>;
  let testComponent;
  let radioInputDebug: DebugElement;
  let radioInputCmp: IsRadioInput;
  let radioInput: HTMLElement;
  let radioInputService, registerRadioInputSpy;

  function setValues(controller) {
    fixture = TestBed.createComponent(controller);
    testComponent = fixture.componentInstance;

    radioInputDebug = fixture.debugElement.query(By.directive(IsRadioInput));
    radioInputCmp = radioInputDebug.componentInstance;
    radioInput = radioInputDebug.nativeElement;

    radioInputService = radioInputDebug.injector.get(IsRadioInputService);
    registerRadioInputSpy = spyOn(radioInputService, 'registerRadioInput').and.returnValue(1);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IsRadioInputModule
      ],
      declarations: [
        BasicRadioInputComponent,
        CustomLabelColorRadioInputComponent,
        CustomLabelPositionRadioInputComponent,
        DisabledRadioInputComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  describe('BasicRadioInputComponent', () => {
    beforeEach(() => {
      setValues(BasicRadioInputComponent);
    });

    it('should render label', () => {
      fixture.detectChanges();
      const label = radioInput.querySelector('.is-radio-input__label');

      expect(label).not.toBe(null);
    });

    it('should render outer circle', () => {
      fixture.detectChanges();
      const outerCircle = radioInput.querySelector('.is-radio-input__outer-circle');

      expect(outerCircle).not.toBe(null);
    });

    it('should render inner circle', () => {
      fixture.detectChanges();
      const innerCircle = radioInput.querySelector('.is-radio-input__inner-circle');

      expect(innerCircle).not.toBe(null);
    });

    it('should render visually hidden input', () => {
      fixture.detectChanges();
      const input = radioInput.querySelector('input[type=radio]');

      expect(input).not.toBe(null);
      expect(input.classList).toContain('is-visually-hidden');
    });

    it('should render input text', () => {
      fixture.detectChanges();
      const inputText = radioInput.querySelector('.is-radio-input__text');

      expect(inputText).not.toBe(null);
      expect(inputText.textContent).toContain(fixture.nativeElement.textContent.trim());
    });

    it('should have id', () => {
      fixture.detectChanges();
      const label = radioInput.querySelector('.is-radio-input__label');
      const outerCircle = radioInput.querySelector('.is-radio-input__outer-circle');
      const innerCircle = radioInput.querySelector('.is-radio-input__inner-circle');
      const input = radioInput.querySelector('input[type=radio]');

      expect(label.getAttribute('for')).toEqual('is-radio-1');
      expect(outerCircle.getAttribute('id')).toEqual('radio-outer-is-radio-1');
      expect(innerCircle.getAttribute('id')).toEqual('radio-inner-is-radio-1');
      expect(input.getAttribute('id')).toEqual('is-radio-1');
    });

    it('should have label position "after" as default', () => {
      fixture.detectChanges();

      expect(radioInputCmp.labelPosition).toEqual(IsRadioInputLabelPosition.After);
      expect(radioInput.classList).not.toContain('is-radio-input__text--before');
    });

    it('should checked value and emit on change on input click', () => {
      fixture.detectChanges();
      const input = radioInput.querySelector('input[type=radio]');
      let changedRadioInput;
      radioInputCmp.change.subscribe(val => changedRadioInput = val);
      expect(radioInputCmp.checked).toBeFalsy();

      input.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      expect(radioInputCmp.checked).toBeTruthy();
      expect(radioInput.classList).toContain('is-radio-input--checked');
      expect(changedRadioInput.source).toEqual(radioInputCmp);
      expect(changedRadioInput.value).toEqual(radioInputCmp.value);
    });

    it('should do nothing on input change', () => {
      fixture.detectChanges();
      const input = <HTMLInputElement> radioInput.querySelector('input[type=radio]');
      let changedRadioInput;
      radioInputCmp.change.subscribe(val => changedRadioInput = val);
      expect(radioInputCmp.checked).toBeFalsy();

      input.checked = true;
      input.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(radioInputCmp.checked).toBeFalsy();
    });
  });

  describe('CustomLabelColorRadioInputComponent', () => {
    beforeEach(() => {
      setValues(CustomLabelColorRadioInputComponent);
    });

    it('should have custom label color', () => {
      fixture.detectChanges();
      const inputText = <HTMLElement> radioInput.querySelector('.is-radio-input__text');
      expect(inputText.style.color).toEqual('blue');
    });
  });

  describe('CustomLabelPositionRadioInputComponent', () => {
    beforeEach(() => {
      setValues(CustomLabelPositionRadioInputComponent);
    });

    it('should have custom label position', () => {
      fixture.detectChanges();

      expect(radioInput.classList).toContain('is-radio-input__text--before');
    });
  });

  describe('DisabledRadioInputComponent', () => {
    beforeEach(() => {
      setValues(DisabledRadioInputComponent);
    });

    it('should have diabled input', () => {
      fixture.detectChanges();

      const input = <HTMLInputElement> radioInput.querySelector('input[type=radio]');
      expect(input.disabled).toBeTruthy();
      expect(radioInput.classList).toContain('is-radio-input--disabled');
    });
  });
});

describe('IsRadioGroup', () => {
  let fixture: ComponentFixture<any>;
  let testComponent;
  let radioGroupDebug: DebugElement;
  let radioGroupCmp: IsRadioGroup;
  let radioGroup: HTMLElement;
  let radioInputService, registerRadioInputSpy;

  function setValues(controller) {
    fixture = TestBed.createComponent(controller);
    testComponent = fixture.componentInstance;

    radioGroupDebug = fixture.debugElement.query(By.directive(IsRadioGroup));
    radioGroupCmp = radioGroupDebug.componentInstance;
    radioGroup = radioGroupDebug.nativeElement;

    radioInputService = radioGroupDebug.injector.get(IsRadioInputService);
    registerRadioInputSpy = spyOn(radioInputService, 'registerRadioInput').and.returnValue(1);
    fixture.detectChanges();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IsRadioInputModule
      ],
      declarations: [
        BasicRadioGroup,
        CustomLabelPositionRadioGroupComponent,
        DisabledRadioGroupComponent,
        CustomCheckedUncheckedRadioGroupComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  describe('BasicRadioGroup', () => {
    beforeEach(() => {
      setValues(BasicRadioGroup);
    });

    it('should radio inputs with name', () => {
      const radioInputs = radioGroup.querySelectorAll('is-radio-input');

      for (let i = 0; i < radioInputs.length; i++) {
        const input = radioInputs[i].querySelector('input[type=radio]');
        expect(input.getAttribute('name')).toEqual('is-radio-group-1');
      }
    });

    it('should update radio group selected and value, on radio input change', () => {
      const radioInput = radioGroupDebug.query(By.directive(IsRadioInput));
      const input = radioInput.nativeElement.querySelector('input[type=radio]');
      let radioGroupChanged;
      radioGroupCmp.change.subscribe(val => radioGroupChanged = val);

      input.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      expect(radioGroupCmp.selected.id).toEqual(radioInput.componentInstance.id);
      expect(radioGroupCmp.value).toEqual('1');
      expect(radioGroupChanged.source.id).toEqual(radioInput.componentInstance.id);
      expect(radioGroupChanged.value).toEqual('1');
    });

    it('should update radio input checked property, on radio input change', () => {
      const radioInput = radioGroupDebug.query(By.directive(IsRadioInput));
      const input = radioInput.nativeElement.querySelector('input[type=radio]');
      let radioGroupChanged;
      radioGroupCmp.change.subscribe(val => radioGroupChanged = val);

      input.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      expect(radioInput.componentInstance.checked).toBeTruthy();
    });
  });

  describe('CustomLabelPositionRadioGroupComponent', () => {
    beforeEach(() => {
      setValues(CustomLabelPositionRadioGroupComponent);
    });

    it('should have custom label position', () => {
      const radioInputs = radioGroup.querySelectorAll('is-radio-input');

      for (let i = 0; i < radioInputs.length; i++) {
        expect(radioInputs[i].classList).toContain('is-radio-input__text--before');
      }
    });
  });

  describe('DisabledRadioGroupComponent', () => {
    beforeEach(() => {
      setValues(DisabledRadioGroupComponent);
    });

    it('should have diabled input', () => {
      const radioInputs = radioGroup.querySelectorAll('is-radio-input');

      for (let i = 0; i < radioInputs.length; i++) {
        const input = <HTMLInputElement> radioInputs[i].querySelector('input[type=radio]');
        expect(input.disabled).toBeTruthy();
        expect(radioInputs[i].classList).toContain('is-radio-input--disabled');
      }
    });
  });

  describe('CustomCheckedUncheckedRadioGroupComponent', () => {
    beforeEach(() => {
      setValues(CustomCheckedUncheckedRadioGroupComponent);
    });

    it('should have unchecked radio input with red border color', () => {
      const checkedIsRadioInput = radioGroup.querySelector('.is-radio-input');
      const outerCircle = <HTMLElement> checkedIsRadioInput.querySelector('.is-radio-input__outer-circle');
      const innerCircle = <HTMLElement> checkedIsRadioInput.querySelector('.is-radio-input__inner-circle');

      expect(outerCircle.style.borderColor).toEqual('red');
      expect(innerCircle.style.backgroundColor).toEqual('red');
    });

    it('should have checked radio input with green border color', () => {
      const checkedIsRadioInput = radioGroup.querySelector('.is-radio-input');
      const input = checkedIsRadioInput.querySelector('input[type=radio]');

      input.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      const outerCircle = <HTMLElement> checkedIsRadioInput.querySelector('.is-radio-input__outer-circle');
      const innerCircle = <HTMLElement> checkedIsRadioInput.querySelector('.is-radio-input__inner-circle');

      expect(outerCircle.style.borderColor).toEqual('green');
      expect(innerCircle.style.backgroundColor).toEqual('green');

    });
  });
});

@Component({
  template: `
    <is-radio-input>
      I'm a simple radio input
    </is-radio-input>
  `
})
class BasicRadioInputComponent {
}

@Component({
  template: `
  <is-radio-input labelColor="blue">
    They changed my color
  </is-radio-input>
  `
})
class CustomLabelColorRadioInputComponent {
}

@Component({
  template: `
  <is-radio-input labelPosition="before">
    Now I 'm here
  </is-radio-input>
  `
})
class CustomLabelPositionRadioInputComponent {
}

@Component({
  template: `
  <is-radio-input disabled>
    I'm a disabled radio input
  </is-radio-input>
  `
})
class DisabledRadioInputComponent {
}

@Component({
  template: `
  <is-radio-group>
    <is-radio-input value="1">Member 1</is-radio-input>
    <is-radio-input value="2">Member 2</is-radio-input>
    <is-radio-input value="3">Member 3</is-radio-input>
  </is-radio-group>
  `
})
class BasicRadioGroup {
}

@Component({
  template: `
  <is-radio-group labelPosition="before">
    <is-radio-input value="1">Member 1</is-radio-input>
    <is-radio-input value="2">Member 2</is-radio-input>
    <is-radio-input value="3">Member 3</is-radio-input>
  </is-radio-group>
  `
})
class CustomLabelPositionRadioGroupComponent {
}

@Component({
  template: `
  <is-radio-group disabled>
    <is-radio-input value="1">Member 1</is-radio-input>
    <is-radio-input value="2">Member 2</is-radio-input>
    <is-radio-input value="3">Member 3</is-radio-input>
  </is-radio-group>
  `
})
class DisabledRadioGroupComponent {
}

@Component({
  template: `
  <is-radio-group>
    <is-radio-input value="1"
                    checkedColor="green"
                    uncheckedColor="red">Red when unchecked</is-radio-input>
    <is-radio-input value="2"
                    checkedColor="green"
                    uncheckedColor="red">Red when unchecked</is-radio-input>
  </is-radio-group>
  `
})
class CustomCheckedUncheckedRadioGroupComponent {
}
