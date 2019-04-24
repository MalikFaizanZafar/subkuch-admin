import { Component, DebugElement, NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  FormGroup,
  FormControl,
  FormsModule,
  FormBuilder,
  ReactiveFormsModule
} from '@angular/forms';

import {
  IsMouseUpService,
  MockDesktopBreakpointObserver,
  MockMobileBreakpointObserver,
  DF_COLORS,
  IsCoreModule,
  IsKey
} from '../core/index';
import {
  IsSelect,
  IsSelectModule,
  IsSelectNode
} from './index';
import { IsPortalService } from '../portal/index';

const nestedSelectData = [
  {
    value: 'red',
    displayText: 'Red',
    nodes: [
      {
        value: 'red-light',
        displayText: 'Light Red',
        nodes: []
      },
      {
        value: 'red-dark',
        displayText: 'Dark Red',
        nodes: []
      }
    ]
  },
  {
    value: 'blue',
    displayText: 'Blue',
    nodes: [
      {
        value: 'blue-light',
        displayText: 'Light Blue',
        nodes: []
      },
      {
        value: 'blue-navy',
        displayText: 'Navy Blue',
        nodes: [
          {
            value: 'blue-navy-light',
            displayText: 'Light Navy Blue'
          },
          {
            value: 'blue-navy-dark',
            displayText: 'Dark Navy Blue',
            selected: true
          }
        ]
      }
    ]
  }
];

let fixture: ComponentFixture<any>;

let selectEl: HTMLElement;

let isSelectComponent: IsSelect;

let selectElFixture: DebugElement;

let optionElements: NodeListOf<Element>;

let isSelectInput: Element;

describe('IsSelect', () => {

  beforeEach(async(() => {
    TestBed
    // TODO: fix the tests instead of forcing preserveWhitespaces to true. This is a workaround
    // given that in ng v5 whitespaces were turned on by default, but they are turned off in v6
    .configureCompiler({preserveWhitespaces: true} as any)
    .configureTestingModule({
      imports: [IsCoreModule.forRoot(), IsSelectModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule],
      declarations: [
        BasicSelectController,
        BasicSelectWithDisplayText,
        BasicSelectWithoutPortalController,
        DisabledSelectController,
        TopPlacementSelectController,
        LightThemeSelectController,
        MultiSelectController,
        FixedSizeSelectController,
        SelectAllMultiSelectController,
        PreSelectedSelectController,
        PreMultiSelectedSelectController,
        FormSelectController,
        TemplateSelectController,
        FilterableSelectController,
        NestedSelectController,
        NestedMultiSelectController,
        NestedSelectCustomTemplateController,
        AsyncOptionsController
      ],
      providers: [
        IsMouseUpService,
        IsPortalService,
        {provide: BreakpointObserver, useClass: MockDesktopBreakpointObserver}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  function setValues<T>(controller: Type<T>) {
    fixture = TestBed.createComponent(controller);
    fixture.detectChanges();
    selectElFixture = fixture.debugElement.query(By.directive(IsSelect));
    isSelectComponent = selectElFixture.componentInstance;
    selectEl = selectElFixture.nativeElement;
    isSelectInput = selectEl.querySelector('.is-select__input');
    optionElements = null;
  }

  describe('Basic Select', () => {
    beforeEach(() => {
      setValues(BasicSelectController);
    });

    it('should create the basic select component with options', () => {
      expect(isSelectInput).not.toBe(null);
      expect(isSelectComponent.state).toBe('closed');
    });

    it('should show the select options', () => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(isSelectComponent.state).toBe('opened');
    });

    it('should toggle the selected options list on click', () => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(isSelectComponent.state).toBe('opened');

      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(isSelectComponent.state).toBe('closed');
    });

    it('should select one option from options list', () => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      optionElements = document.querySelectorAll('.is-option');

      optionElements[1].dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(optionElements[1].classList.contains('is-option--selected'))
        .toBe(true);
    });

    it('should stop bubbling up the click event', () => {
      const event = new MouseEvent('click');
      const eventSpy = spyOn(event, 'stopPropagation').and.callThrough();
      isSelectComponent.onComponentClick(event);
      expect(eventSpy).toHaveBeenCalled();
    });

    it('should update the view when model is changed', () => {
      const param = 'VE';
      isSelectComponent.writeValue(param);
      fixture.detectChanges();
      expect(isSelectInput.querySelector('.is-select__input-text div').textContent).toContain('Versata');
    });

    it('should select values when using the arrow keys', () => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      optionElements = document.querySelectorAll('.is-option');

      document.dispatchEvent(new KeyboardEvent('keyup', {code: IsKey.ArrowDown}));
      fixture.detectChanges();
      expect(optionElements[0].classList.contains('is-option--temporary-selected')).toBe(true);

      document.dispatchEvent(new KeyboardEvent('keyup', {code: IsKey.ArrowUp}));
      fixture.detectChanges();
      expect(optionElements[1].classList.contains('is-option--temporary-selected')).toBe(true);

      document.dispatchEvent(new KeyboardEvent('keyup', {code: IsKey.ArrowDown}));
      fixture.detectChanges();
      expect(optionElements[0].classList.contains('is-option--temporary-selected')).toBe(true);
    });

    it('should select values when typing on the keyboard', () => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      optionElements = selectEl.querySelectorAll('.is-option');

      document.dispatchEvent(new KeyboardEvent('keypress', {key: 'a'}));
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(optionElements[0].classList.contains('is-option--selected')).toBe(true);
      });
    });

    it('should close the options list using the keyboard', () => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(isSelectComponent.state).toBe('opened');

      document.dispatchEvent(new KeyboardEvent('keyup', {code: IsKey.Enter}));
      fixture.detectChanges();
      expect(isSelectComponent.state).toBe('closed');

      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(isSelectComponent.state).toBe('opened');

      document.dispatchEvent(new KeyboardEvent('keyup', {code: IsKey.Esc}));
      fixture.detectChanges();
      expect(isSelectComponent.state).toBe('closed');
    });

    describe('hasBackrop', () => {
      beforeEach(() => {
        const backdrop = document.querySelector('.cdk-overlay-backdrop');
        if (backdrop) {
          // we need to clean the DOM before doing any tests related to the backdrop
          backdrop.remove();
        }
      });

      it('should render backdrop by default', () => {
        isSelectInput.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        const backdrop = document.querySelector('.cdk-overlay-backdrop');
        expect(backdrop).toBeDefined();
      });

      it('should not render backdrop when hasBackdrop is disabled', () => {
        fixture.componentInstance.hasBackdrop = false;
        fixture.detectChanges();
        isSelectInput.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        const backdrop = document.querySelector('.cdk-overlay-backdrop');
        expect(backdrop).toBeNull();
      });
    });
  });

  describe('Basic Select with displayText', () => {
    beforeEach(() => {
      setValues(BasicSelectWithDisplayText);
    });

    it('should change the option template when the displayText is changed', () => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      let firstOption = document.body.querySelectorAll('.is-option')[0];
      expect(firstOption.textContent.trim()).toBe('Item1');

      const testComponent = fixture.debugElement.componentInstance;
      testComponent.changeOptions();

      fixture.detectChanges();
      firstOption = document.body.querySelectorAll('.is-option')[0];
      expect(firstOption.textContent.trim()).toBe('NewText');
    });
  });

  describe('Filterable Select', () => {
    beforeEach(() => {
      setValues(FilterableSelectController);
    });

    it('should create the basic select component with options', () => {
      expect(isSelectInput).not.toBe(null);
      expect(isSelectComponent.state).toBe('closed');
    });

    it('should filter data on input', async(() => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      const options = <NodeListOf<Element>> document.querySelectorAll('.is-option');
      expect(options.length).toEqual(5);

      const filterInput = <HTMLInputElement> document.querySelector('.is-select__filter-input__input');
      expect(filterInput).not.toBeNull();
      filterInput.value = 'Au';

      filterInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      filterInput.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const invisibleItems = document.querySelectorAll('.is-option.is-option--invisible');
        expect(invisibleItems.length).toEqual(4);
      });
    }));

    it('should show no matches found', async(() => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      const filterInput = <HTMLInputElement> document.querySelector('.is-select__filter-input__input');
      filterInput.value = 'Aum';

      filterInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const matchesFoundEl = <NodeListOf<Element>> document.querySelectorAll('.is-option');

        expect(matchesFoundEl.length).toEqual(1);
        const element = <HTMLElement> matchesFoundEl[0];
        expect(element.innerText).toContain('No matches found');
      });
    }));

    it('should select first filtered option, and should only navigate with arrow keys between filtered options', () => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      const options = <NodeListOf<Element>> document.querySelectorAll('.is-option');
      expect(options.length).toEqual(5);

      const filterInput = <HTMLInputElement> document.querySelector('.is-select__filter-input__input');
      expect(filterInput).not.toBeNull();
      filterInput.value = 's';

      filterInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      filterInput.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(options[0].classList.contains('is-option--temporary-selected')).toBe(false);
      expect(options[1].classList.contains('is-option--temporary-selected')).toBe(true);
      expect(options[2].classList.contains('is-option--temporary-selected')).toBe(false);
      expect(options[3].classList.contains('is-option--temporary-selected')).toBe(false);
      expect(options[4].classList.contains('is-option--temporary-selected')).toBe(false);

      document.dispatchEvent(new KeyboardEvent('keyup', { code: IsKey.ArrowDown }));
      fixture.detectChanges();
      expect(options[0].classList.contains('is-option--temporary-selected')).toBe(false);
      expect(options[1].classList.contains('is-option--temporary-selected')).toBe(false);
      expect(options[2].classList.contains('is-option--temporary-selected')).toBe(true);
      expect(options[3].classList.contains('is-option--temporary-selected')).toBe(false);
      expect(options[4].classList.contains('is-option--temporary-selected')).toBe(false);

      document.dispatchEvent(new KeyboardEvent('keyup', { code: IsKey.ArrowDown }));
      fixture.detectChanges();
      expect(options[0].classList.contains('is-option--temporary-selected')).toBe(false);
      expect(options[1].classList.contains('is-option--temporary-selected')).toBe(false);
      expect(options[2].classList.contains('is-option--temporary-selected')).toBe(false);
      expect(options[3].classList.contains('is-option--temporary-selected')).toBe(true);
      expect(options[4].classList.contains('is-option--temporary-selected')).toBe(false);

      document.dispatchEvent(new KeyboardEvent('keyup', { code: IsKey.ArrowDown }));
      fixture.detectChanges();
      expect(options[0].classList.contains('is-option--temporary-selected')).toBe(false);
      expect(options[1].classList.contains('is-option--temporary-selected')).toBe(true);
      expect(options[2].classList.contains('is-option--temporary-selected')).toBe(false);
      expect(options[3].classList.contains('is-option--temporary-selected')).toBe(false);
      expect(options[4].classList.contains('is-option--temporary-selected')).toBe(false);

      document.dispatchEvent(new KeyboardEvent('keyup', { code: IsKey.ArrowUp }));
      fixture.detectChanges();
      expect(options[0].classList.contains('is-option--temporary-selected')).toBe(false);
      expect(options[1].classList.contains('is-option--temporary-selected')).toBe(false);
      expect(options[2].classList.contains('is-option--temporary-selected')).toBe(false);
      expect(options[3].classList.contains('is-option--temporary-selected')).toBe(true);
      expect(options[4].classList.contains('is-option--temporary-selected')).toBe(false);

      document.dispatchEvent(new KeyboardEvent('keyup', { code: IsKey.ArrowUp }));
      fixture.detectChanges();
      expect(options[0].classList.contains('is-option--temporary-selected')).toBe(false);
      expect(options[1].classList.contains('is-option--temporary-selected')).toBe(false);
      expect(options[2].classList.contains('is-option--temporary-selected')).toBe(true);
      expect(options[3].classList.contains('is-option--temporary-selected')).toBe(false);
      expect(options[4].classList.contains('is-option--temporary-selected')).toBe(false);
    });
  });

  describe('mobile-view', () => {
    beforeEach(() => {
      TestBed.overrideProvider(BreakpointObserver, {useValue: new MockMobileBreakpointObserver()});
      setValues(BasicSelectController);
    });

    afterEach(() => {
      const portal = document.querySelector('.is-portal');
      if (portal) {
        portal.parentElement.removeChild(portal);
      }
    });

    it('should show the select options and overlay', (done: DoneFn) => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(isSelectComponent.useMobileOptions).toBeTruthy();
        expect(isSelectComponent.state).toBe('opened');

        const portal = <HTMLElement> document.querySelector('.is-portal--full');
        expect(portal).not.toBeNull();
        expect(portal.classList).toContain('is-select-portal');
        expect(portal.classList).toContain('is-portal--auto-height');
        done();
      });
    });

    it('should hide options and overlay', (done: DoneFn) => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(isSelectComponent.useMobileOptions).toBeTruthy();
        expect(isSelectComponent.state).toBe('opened');
        const portal = <HTMLElement> document.querySelector('.is-portal--full');
        expect(portal).not.toBeNull();

        document.dispatchEvent(new KeyboardEvent('keyup', {code: IsKey.Esc}));
        fixture.detectChanges();
        expect(isSelectComponent.state).toBe('closed');

        done();
      });
    });
  });

  describe('mobile-view-no-portal', () => {
    beforeEach(() => {
      TestBed.overrideProvider(BreakpointObserver, {
        useValue: new MockMobileBreakpointObserver()
      });
      setValues(BasicSelectWithoutPortalController);
    });

    afterEach(() => {
      const portal = document.querySelector('.is-portal');
      if (portal) {
        portal.parentElement.removeChild(portal);
      }
    });

    it('should not show the select options in portal when showPortalOnMobile is false', (done: DoneFn) => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(isSelectComponent.useMobileOptions).toBeFalsy();
        expect(isSelectComponent.state).toBe('opened');
        expect(document.querySelector('.is-portal--full')).toBeNull();
        done();
      });
    });
  });

  describe('Disable Select', () => {
    beforeEach(() => {
      setValues(DisabledSelectController);
    });

    it('should disable the select input', () => {
      expect(isSelectInput).not.toBe(null);
      expect(selectEl.classList.contains('is-select--disabled')).toBe(true);
    });

    it('should not do anything on click', () => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(isSelectComponent.state).toBe('closed');
    });
  });

  describe('Top placement Select', () => {
    beforeEach(() => {
      setValues(TopPlacementSelectController);
    });

    it('it should set the select options on top', () => {
      expect(isSelectInput).not.toBe(null);
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      const optionsContainer = document.querySelector('.is-select__options');
      expect(optionsContainer.classList.contains('is-select__options--top')).toBe(true);
    });
  });

  describe('Light theme Select', () => {
    beforeEach(() => {
      setValues(LightThemeSelectController);
    });

    it('should set the light background on the options list', () => {
      expect(isSelectInput).not.toBe(null);
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      const optionsContainer = document.querySelector('.is-select__options');
      expect(optionsContainer.classList.contains('is-select__options--light')).toBe(true);
    });
  });

  describe('MultiSelect', () => {
    beforeEach(() => {
      setValues(MultiSelectController);
    });

    it('should allow multiselect', () => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      optionElements = document.querySelectorAll('.is-option');
      expect(optionElements).not.toBe(null);

      optionElements[1].dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(optionElements[1].classList.contains('is-option--selected'))
        .toBe(true);

      optionElements[3].dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(isSelectComponent.selectedOptions.length).toBe(2);
      expect(optionElements[3].classList.contains('is-option--selected'))
        .toBe(true);
    });
  });

  describe('Fixed Size Select', () => {
    beforeEach(() => {
      setValues(FixedSizeSelectController);
    });

    it('should not allow resizing for multiselect', () => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      optionElements = document.querySelectorAll('.is-option');

      expect(optionElements).not.toBe(null);

      optionElements[1].dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(isSelectComponent.isSelectDisplayText.trim())
        .toBe('Versata');

      optionElements[3].dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(isSelectComponent.isSelectDisplayText).toBe('2 Selected');
    });
  });

  describe('Select All with MultiSelect', () => {
    beforeEach(() => {
      setValues(SelectAllMultiSelectController);
    });

    it('should have an option for select all', () => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(isSelectComponent.allowSelectAll).toBe(true);
    });

    it('should select and deselect all the items', () => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      optionElements = document.querySelectorAll('.is-option');
      optionElements[0].dispatchEvent(new Event('change'));
      fixture.detectChanges();
      let selectedItems = document.querySelectorAll('.is-option--selected');
      expect(selectedItems.length).toBe(5);

      optionElements[0].dispatchEvent(new Event('change'));
      fixture.detectChanges();
      selectedItems = document.querySelectorAll('.is-option--selected');
      expect(selectedItems.length).toBe(0);
    });

    it('should uncheck select all on clicking any option', () => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      optionElements = document.querySelectorAll('.is-option');
      optionElements[0].dispatchEvent(new Event('change'));
      fixture.detectChanges();
      let selectedItems = document.querySelectorAll('.is-option--selected');
      expect(selectedItems.length).toBe(5);

      selectedItems[3].dispatchEvent(new Event('click'));
      fixture.detectChanges();
      selectedItems = document.querySelectorAll('.is-option--selected');
      expect(selectedItems.length).toBe(4);
      expect(isSelectComponent.isSelectedAll).toBe(false);
    });
  });

  describe('Pre-Selected Select', () => {
    beforeEach(() => {
      setValues(PreSelectedSelectController);
    });

    it('should select the option on load', () => {
      isSelectComponent.isSelectValue = 'CR';
      fixture.detectChanges();
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      const selectedItems = document.querySelectorAll('.is-option--selected');
      expect(selectedItems.length).toBe(1);
      expect(isSelectComponent.isSelectDisplayText.trim()).toBe('CrossOver');
    });
  });

  describe('Pre-Selected multi select', () => {
    beforeEach(() => {
      setValues(PreMultiSelectedSelectController);
    });

    it('should select the multiple options on load for multiselect', (done: DoneFn) => {
      fixture.detectChanges();
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(isSelectComponent.isSelectDisplayText.trim()).toBe('Aurea, Versata, CrossOver');
        const selectedItems = document.querySelectorAll('.is-option--selected');
        expect(selectedItems.length).toBe(3);
        done();
      });
    });
  });

  describe('Control value acessor', () => {
    beforeEach(() => {
      setValues(FormSelectController);
    });

    it(`shouldn't trigger a view->model change when write value is called`, () => {
      const changeSpy = jasmine.createSpy('changeSpy');
      isSelectComponent.registerOnChange(changeSpy);
      isSelectComponent.writeValue(true);
      expect(changeSpy).not.toHaveBeenCalled();
    });

    it(`should trigger a view->model change when a new value is selected`, () => {
      const changeSpy = jasmine.createSpy('changeSpy');
      isSelectComponent.registerOnChange(changeSpy);
      isSelectComponent.isSelectValue = true;
      expect(changeSpy).toHaveBeenCalled();
    });

    it(`should clear the display text when no value is selected`, () => {
      expect(isSelectComponent.isSelectDisplayText).toBe('');
      (fixture.componentInstance as FormSelectController).formControl.setValue('CR');
      fixture.detectChanges();
      expect(isSelectComponent.isSelectDisplayText).not.toBe('');
      (fixture.componentInstance as FormSelectController).formControl.setValue(null);
      fixture.detectChanges();
      expect(isSelectComponent.isSelectDisplayText).toBe('');
    });

    it('should set disabled true if form is disabled', () => {
      expect(isSelectComponent.disabled).toBeFalsy();
      (fixture.componentInstance as FormSelectController).form.disable();
      expect(isSelectComponent.disabled).toBeTruthy();
    });

    it('should set disabled false if form is enabled', () => {
      expect(isSelectComponent.disabled).toBeFalsy();
      (fixture.componentInstance as FormSelectController).form.disable();
      expect(isSelectComponent.disabled).toBeTruthy();
      (fixture.componentInstance as FormSelectController).form.enable();
      expect(isSelectComponent.disabled).toBeFalsy();
    });
  });

  describe('Custom Template controller', () => {
    beforeEach(() => {
      setValues(TemplateSelectController);
    });

    it('should set the custom template', () => {
      expect(isSelectComponent.customInputContent).toBeDefined();
    });

    it('should select one option from options list and should set the background color for label', () => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      optionElements = document.querySelectorAll('.is-option');

      optionElements[1].dispatchEvent(new Event('click'));
      fixture.detectChanges();
      const label = isSelectInput.querySelector('label');
      expect(label).not.toBe(null);
      expect(label.style.backgroundColor).toBe('rgb(232, 224, 75)');
    });
  });

  describe('Nested Select', () => {
    beforeEach(() => {
      setValues(NestedSelectController);
    });

    it('should set nestedIterationPath and currentTreeData', () => {
      expect(isSelectComponent.nestedIterationPath.length).not.toEqual(0);
      expect(isSelectComponent.currentTreeData).toBeDefined();
    });

    it('should show the selected options tree data on open', (done: DoneFn) => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(isSelectComponent.state).toBe('opened');
        const optionsList = document.body.querySelector('.is-select__options-list');
        const isOptions = optionsList.querySelectorAll('is-option');
        expect(isOptions.length).toEqual(2);
        const selectedIsOption = <HTMLElement> isOptions[1];
        expect(selectedIsOption.innerText).toEqual('Dark Navy Blue');
        expect(isSelectComponent.isSelectDisplayText).toEqual('Dark Navy Blue');
        done();
      });
    });

    it('should show the back button if the option displayed does not belong to root', (done: DoneFn) => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(isSelectComponent.state).toBe('opened');
        const options = document.body.querySelector('.is-select__options');
        const backButton = <HTMLButtonElement> options.querySelector('.is-select__back-button');
        expect(backButton).not.toBeNull();
        done();
      });
    });

    it('should change the option to parent nodes on click of back button', async(() => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(isSelectComponent.state).toBe('opened');
        const options = document.body.querySelector('.is-select__options');
        const backButton = <HTMLButtonElement> options.querySelector('.is-select__back-button');
        backButton.click();
        fixture.detectChanges();
        const optionsList = document.body.querySelector('.is-select__options-list');
        const isOptions = optionsList.querySelectorAll('is-option');
        expect(isOptions.length).toEqual(2);
        const option0 = <HTMLElement> isOptions[0];
        expect(option0.innerText).toEqual('Light Blue');
        const option1 = <HTMLElement> isOptions[1];
        expect(option1.innerText).toEqual('Navy Blue');
      });
    }));

    it('should not show back button when options are root options', async(() => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(isSelectComponent.state).toBe('opened');
        const options = document.body.querySelector('.is-select__options');
        const backButton = <HTMLButtonElement> options.querySelector('.is-select__back-button');
        backButton.click();
        fixture.detectChanges();
        backButton.click();
        fixture.detectChanges();
        const optionsList = document.body.querySelector('.is-select__options-list');
        const isOptions = optionsList.querySelectorAll('is-option');
        expect(isOptions.length).toEqual(2);
        const option0 = <HTMLElement> isOptions[0];
        expect(option0.innerText).toEqual('Red');
        const option1 = <HTMLElement> isOptions[1];
        expect(option1.innerText).toEqual('Blue');
        expect(options.querySelector('.is-select__back-button')).toBeNull();
      });
    }));

    it('should select one option from options list', async(() => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const optionsList = document.body.querySelector('.is-select__options-list');
        optionElements = optionsList.querySelectorAll('is-option');
        expect(isSelectComponent.isSelectDisplayText).toEqual('Dark Navy Blue');
        optionElements[0].dispatchEvent(new Event('click'));
        fixture.detectChanges();
        expect(isSelectComponent.isSelectDisplayText).toEqual('Light Navy Blue');
      });
    }));
  });

  describe('Nested Select: Multiselect', () => {
    beforeEach(() => {
      setValues(NestedMultiSelectController);
    });

    afterEach(() => {
      const selects = document.body.querySelectorAll('is-select');
      for (let i = 0; i < selects.length; i++ ) {
        selects[i].remove();
      }
    });

    it('should select multiple option from options list', () => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      const optionsList = document.body.querySelector('.is-select__options-list');
      const isOptions = optionsList.querySelectorAll('is-option');
      expect(isSelectComponent.isSelectDisplayText).toEqual('Dark Navy Blue');
      isOptions[0].dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(isSelectComponent.isSelectDisplayText).toEqual('Dark Navy Blue, Light Navy Blue');
    });
  });

  describe('Nested Select: Custom Template', () => {
    beforeEach(() => {
      setValues(NestedSelectCustomTemplateController);
    });

    it('should show the custom template', async(() => {
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(isSelectComponent.state).toBe('opened');
        const optionsList = document.body.querySelector('.is-select__options-list');
        const isOptions = optionsList.querySelectorAll('is-option');
        expect(isOptions.length).toEqual(2);
        const selectedIsOption = <HTMLElement> isOptions[1];
        expect(selectedIsOption.innerText).toEqual('blue-navy-dark - Dark Navy Blue');
      });
    }));
  });

  describe('Async Options', () => {

    beforeEach(() => {
      setValues(AsyncOptionsController);
    });

    it('should trigger the dropdownOpen method when dropdown is opened', () => {
      spyOn(isSelectComponent, 'onDropdownOpen');
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(isSelectComponent.onDropdownOpen).toHaveBeenCalled();
    });

    it('should trigger filterChange method when filter value is changed', () => {
      spyOn(isSelectComponent, 'onFilterChange');

      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      const filterInput = <HTMLInputElement> document.querySelector('.is-select__filter-input__input');
      expect(filterInput).not.toBeNull();
      filterInput.value = 'Au';
      filterInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      filterInput.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      expect(isSelectComponent.onFilterChange).toHaveBeenCalled();
    });

    it('should not show loading spinner by default', () => {
      const loading = <HTMLInputElement> document.querySelector('.is-select__loading');
      expect(loading).toBeNull();
    });

    it('should show loading spinner when dropdown is open', () => {
      isSelectInput.dispatchEvent(new Event('click'));
      const loading = <HTMLInputElement> document.querySelector('.is-select__loading');
      expect(loading).toBeDefined();
    });

    it('should preserve filter text if it has previously been set', (done: DoneFn) => {
      isSelectComponent.isSelectFilterText = 'query';
      isSelectInput.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      const filterInput = <HTMLInputElement> document.querySelector('.is-select__filter-input__input');
      fixture.whenStable().then(() => {
        expect(filterInput).toBeDefined();
        expect(filterInput.value).not.toBeUndefined();
        expect(filterInput.value).toBe('query');
        done();
      });
    });
  });
});

@Component({
  template: `
  <is-select [(ngModel)]="selected"
             [hasBackdrop]="hasBackdrop">
    <is-option value="AU"> Aurea </is-option>
    <is-option value="VE"> Versata </is-option>
  </is-select>`
})
class BasicSelectController {
  selected: string | string[] = null;
  hasBackdrop = true;
}

@Component({
  template: `
  <is-select [(ngModel)]="selected"
             showPortalOnMobile="false">
    <is-option value="AU"> Aurea </is-option>
    <is-option value="VE"> Versata </is-option>
  </is-select>`
})
class BasicSelectWithoutPortalController {
  selected: string | string[] = null;
}

@Component({
  template: `
  <is-select [(ngModel)]="selected"
             disabled="true">
    <is-option value="AU"> Aurea </is-option>
  </is-select>`
})
class DisabledSelectController { }

@Component({
  template: `
  <is-select [(ngModel)]="selected"
             placement="top">
    <is-option value="AU"> Aurea </is-option>
    <is-option value="VE"> Versata </is-option>
  </is-select>`
})
class TopPlacementSelectController { }

@Component({
  template: `
  <is-select [(ngModel)]="selected"
             background="light">
    <is-option value="AU"> Aurea </is-option>
    <is-option value="VE"> Versata </is-option>
  </is-select>`
})
class LightThemeSelectController { }

@Component({
  template: `
  <is-select [(ngModel)]="selected"
             multiselect="true">
    <is-option value="AU"> Aurea </is-option>
    <is-option value="VE"> Versata </is-option>
    <is-option value="CR"> CrossOver </is-option>
    <is-option value="FD"> FirstData </is-option>
    <is-option value="UP"> Upland </is-option>
  </is-select>`
})
class MultiSelectController { }

@Component({
  template: `
  <is-select [(ngModel)]="selected"
             multiselect="true"
             autoSize="false">
    <is-option value="AU"> Aurea </is-option>
    <is-option value="VE"> Versata </is-option>
    <is-option value="CR"> CrossOver </is-option>
    <is-option value="FD"> FirstData </is-option>
    <is-option value="UP"> Upland </is-option>
  </is-select>`
})
class FixedSizeSelectController { }

@Component({
  template: `
  <is-select [(ngModel)]="emptyMessageSelectedOrg"
             placeholder="I am filterable select"
             filterPlaceholder="Custom Filter"
             emptyMessage="No matches found"
             filterable="true">
    <is-option value="AU"> Aurea </is-option>
    <is-option value="VE"> Versata </is-option>
    <is-option value="CR"> CrossOver </is-option>
    <is-option value="FD"> FirstData </is-option>
    <is-option value="UP"> Upland </is-option>
  </is-select>`
})
class FilterableSelectController { }

@Component({
  template: `
  <is-select [(ngModel)]="selected"
             multiselect="true"
             showSelectAll="true">
    <is-option value="AU"> Aurea </is-option>
    <is-option value="VE"> Versata </is-option>
    <is-option value="CR"> CrossOver </is-option>
    <is-option value="FD"> FirstData </is-option>
    <is-option value="UP"> Upland </is-option>
  </is-select>`
})
class SelectAllMultiSelectController { }

@Component({
  template: `
  <is-select [(ngModel)]="selected">
    <is-option value="AU"> Aurea </is-option>
    <is-option value="VE"> Versata </is-option>
    <is-option value="CR"> CrossOver </is-option>
    <is-option value="FD"> FirstData </is-option>
    <is-option value="UP"> Upland </is-option>
  </is-select>`
})
class PreSelectedSelectController {
  selected = 'CR';
}

@Component({
  template: `
  <is-select [(ngModel)]="selected" [multiselect]="true">
    <is-option value="AU"> Aurea </is-option>
    <is-option value="VE"> Versata </is-option>
    <is-option value="CR"> CrossOver </is-option>
    <is-option value="FD"> FirstData </is-option>
    <is-option value="UP"> Upland </is-option>
  </is-select>`
})
class PreMultiSelectedSelectController {
  selected = ['AU', 'VE', 'CR'];
}

@Component({
  template: `
  <is-select [(ngModel)]="selected">
    <is-option *ngFor="let option of options"
                [value]="option"
                [displayText]="option"></is-option>
  </is-select>`
})
class BasicSelectWithDisplayText {
  options = ['Item1', 'Item2', 'Item3'];

  changeOptions() {
    const arr = [...this.options];
    arr[0] = 'NewText';
    this.options = arr;
  }
}

@Component({
  template: `
  <form [formGroup]="form">
    <is-select [formControl]="formControl">
      <is-option value="AU"> Aurea </is-option>
      <is-option value="VE"> Versata </is-option>
      <is-option value="CR"> CrossOver </is-option>
      <is-option value="FD"> FirstData </is-option>
      <is-option value="UP"> Upland </is-option>
    </is-select>
  </form>`
})
class FormSelectController {
  form: FormGroup;
  formControl = new FormControl();

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({});
    this.form.addControl('formControl', this.formControl);
  }
}

@Component({
  template: `
  <is-select [customInputContent]="customInputTemplate"
             placeholder="e.g. Red">
    <is-option *ngFor="let option of colors"
                value="{{option.value}}">{{option.displayText}}
    </is-option>
  </is-select>

  <ng-template #customInputTemplate
               let-data="data">
    <span class="mr-1"
          *ngFor="let item of data">
      <label [style.background-color]="item.value">
        {{item.displayText}}
      </label>
    </span>
  </ng-template>`
})
class TemplateSelectController {
  colors = [
    { value: DF_COLORS.RED, displayText: 'Red' },
    { value: DF_COLORS.YELLOW, displayText: 'Yellow' },
    { value: DF_COLORS.AMBER, displayText: 'Amber' },
    { value: DF_COLORS.BLUE, displayText: 'Blue' },
    { value: DF_COLORS.GREEN, displayText: 'Green' },
    { value: DF_COLORS.LIGHT_GREY, displayText: 'Light Grey' },
    { value: DF_COLORS.LIGHT_STEEL_BLUE, displayText: 'Light Steel Blue' }
  ];
}

@Component({
  template: `
  <is-select nested="true"
             [data]="selectData">
  </is-select>`
})
class NestedSelectController {
  selectData = nestedSelectData;
}

@Component({
  template: `
  <is-select nested="true"
             [data]="selectData"
             multiselect="true"
             (change)="onSelectChange($event)">
  </is-select>`
})
class NestedMultiSelectController {
  selectData = nestedSelectData;
  selectEmittedValue: any;

  onSelectChange(nodes: IsSelectNode[]) {
    this.selectEmittedValue = nodes;
  }
}

@Component({
  template: `
  <is-select filterable="true"
             nested="true"
             placeholder="e.g. Red"
             [data]="selectData">
    <ng-template let-option
                 isOptionTemplate>
      {{option.value}} - {{option.displayText}}
    </ng-template>
  </is-select>`
})
class NestedSelectCustomTemplateController {
  selectData = nestedSelectData;
}

@Component({
  template: `
  <is-select [(ngModel)]="selectedAsync"
             filterable="true"
             (dropdownOpen)="fetchOptions()"
             [loading]="loadingOptions"
             [asyncFilter]="true"
             (filterChange)="onFilterChange($event)"
             [preserveFilterText]="preserveFilterText">
    <is-option *ngFor="let option of asyncOptions"
               [value]="option">
      {{option}}
    </is-option>
  </is-select>`
})
class AsyncOptionsController {
  selectedAsync: string = null;
  options: string[] = [];
  loadingOptions = false;
  preserveFilterText = true;

  fetchOptions() {
    this.options = ['test1', 'test2'];
    this.loadingOptions = true;
  }

  onFilterChange() {
  }
}
