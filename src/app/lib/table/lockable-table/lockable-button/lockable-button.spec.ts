import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IsTableModule } from '../../table.module';
import { IsTableService } from '../../table.service';
import { IsLockableButton } from './lockable-button';


describe('IsLockableButton', () => {
  let fixture: ComponentFixture<any>;
  let testComponent;
  let lockableButtonDebug: DebugElement;
  let lockableButtonCmp: IsLockableButton;
  let lockableButton: HTMLElement;
  let tableService;

  function setValues(controller) {
    fixture = TestBed.createComponent(controller);
    testComponent = fixture.componentInstance;

    lockableButtonDebug = fixture.debugElement.query(By.directive(IsLockableButton));
    lockableButtonCmp = lockableButtonDebug.componentInstance;
    lockableButton = lockableButtonDebug.nativeElement;

    tableService = lockableButtonDebug.injector.get(IsTableService);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IsTableModule.forRoot(),
        BrowserAnimationsModule
      ],
      declarations: [
        BasicLockableButtonComponent
      ],
      providers: [ IsTableService ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  describe('BasicLockableButtonComponent', () => {
    beforeEach(() => {
      setValues(BasicLockableButtonComponent);
    });

    it('should render unlocked icon if button is unlocked', () => {
      fixture.detectChanges();

      const icon = lockableButton.querySelector('i');

      expect(icon.classList.contains('fa fa-unlock-alt'));
    });

    it('should render locked icon if button is locked', () => {
      fixture.detectChanges();
      testComponent.locked = true;
      fixture.detectChanges();

      const icon = lockableButton.querySelector('i');

      expect(icon.classList.contains('fa fa-lock'));
    });

    it('should toggle locked state and emit onLock with locked state on click', () => {
      fixture.detectChanges();

      const locked = lockableButtonCmp.locked;
      let lockedStateEmitted;
      lockableButtonCmp.onLock.subscribe(val => lockedStateEmitted = val);

      lockableButton.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      expect(lockableButtonCmp.locked).toEqual(!locked);
      expect(lockedStateEmitted).toEqual(!locked);
    });
  });
});

@Component({
  template: `
    <is-lockable-button [locked]="locked"></is-lockable-button>
  `
})
class BasicLockableButtonComponent {
  locked = false;
}
