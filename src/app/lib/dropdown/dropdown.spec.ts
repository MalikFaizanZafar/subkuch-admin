import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IsDropdownModule, IsDropdown } from './index';
import { By } from '@angular/platform-browser';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { IsDropdownPlacement } from './dropdown-placement';

describe('IsDropdown', () => {
  describe('without configuration', () => {
    let testComponent: TestDropdownComponent;
    let fixture: ComponentFixture<TestDropdownComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          IsDropdownModule.forRoot(),
          NgbDropdownModule.forRoot()
        ],
        declarations: [
          TestDropdownComponent
        ]
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TestDropdownComponent);
      testComponent = fixture.componentInstance;
    });

    it('defines the dropdown', () => {
      expect(testComponent).toBeDefined();
    });

    it('has title, default dropdown button and placement', () => {
      const dropdownDE = fixture.debugElement.query(By.directive(IsDropdown));
      const dropdown: IsDropdown = dropdownDE.componentInstance;
      fixture.detectChanges();
      expect(dropdown.title).toEqual('Dropdown Title');
      expect(dropdown.placement).toEqual(IsDropdownPlacement.Left);
      expect(dropdown.basicButton).toEqual(false);
      expect(dropdown.inverse).toEqual(true);
    });

    it('has number of dropdown items', () => {
      const dropdownDE = fixture.debugElement.queryAll(By.css('.dropdown-item'));
      expect(dropdownDE.length).toEqual(3);
    });
  });

  describe('with configuration', () => {
    let testComponentWithConfiguration: TestDropdownWithConfigurationComponent;
    let fixtureWithConfiguration: ComponentFixture<TestDropdownWithConfigurationComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          IsDropdownModule.forRoot(
            { inverse: true, placement: IsDropdownPlacement.Right }),
          NgbDropdownModule.forRoot()
        ],
        declarations: [
          TestDropdownWithConfigurationComponent
        ]
      }).compileComponents();
    });

    beforeEach(() => {
      fixtureWithConfiguration = TestBed.createComponent(TestDropdownWithConfigurationComponent);
      testComponentWithConfiguration = fixtureWithConfiguration.componentInstance;
    });

    it('defines the dropdown', () => {
      expect(testComponentWithConfiguration).toBeDefined();
    });

    it('has inverse and placement propert set globally', () => {
      const dropdownDE = fixtureWithConfiguration.debugElement.query(By.directive(IsDropdown));
      const dropdown: IsDropdown = dropdownDE.componentInstance;
      fixtureWithConfiguration.detectChanges();
      expect(dropdown.options.inverse).toEqual(true);
      expect(dropdown.options.placement).toEqual(IsDropdownPlacement.Right);
    });
  });
});

@Component({
  template: `
            <is-dropdown [title]="'Dropdown Title'"
                         [placement]="placement"
                         [basicButton]="false"
                         [inverse]="true">
              <span class="dropdown-item">
                Action - 1
              </span>
              <span class="dropdown-item">
                Another Action
              </span>
              <span class="dropdown-item">
                Something else is here
              </span>
            </is-dropdown>`
})
class TestDropdownComponent {
  placement = IsDropdownPlacement.Left;
}

@Component({
  template: `
            <is-dropdown>
              <span class="dropdown-item">
                Action - 1
              </span>
              <span class="dropdown-item">
                Another Action
              </span>
              <span class="dropdown-item">
                Something else is here
              </span>
            </is-dropdown>`
})
class TestDropdownWithConfigurationComponent {
}
