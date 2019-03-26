import { Component, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as apiRef from '../../app/module/components/pages/modal/api-ref';
import { IsModalDismissReasons } from './modal-dismiss-reasons';
import { IsModalSize } from './modal-size';
import { IsModalModule } from './modal.module';
import { IsModalService } from './modal.service';

describe('IsModal', () => {
  let fixture: ComponentFixture<any>;
  let testComponent;
  let testComponentHTML: HTMLElement;
  let openBtn: HTMLButtonElement;

  function setValues(controller) {
    fixture = TestBed.createComponent(controller);
    testComponent = fixture.componentInstance;
    testComponentHTML = fixture.nativeElement;
    openBtn = <HTMLButtonElement> testComponentHTML.querySelector('button.open-btn');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IsModalModule.forRoot(),
        BrowserAnimationsModule
      ],
      declarations: [
        BasicModalComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  describe('BasicModalComponent', () => {
    beforeEach(() => {
      setValues(BasicModalComponent);

      const modals = document.body.querySelectorAll('is-modal');
      for (let i = 0; i < modals.length; i++ ) {
        document.body.removeChild(modals[i]);
      }
    });

    it('should render backdrop for default modal options', () => {
      openBtn.dispatchEvent(new Event('click'));
      const backdrop = document.body.querySelector('.is-modal__backdrop');
      expect(backdrop).not.toBe(null);
    });

    it('should not render backdrop if backdrop is false in modal options', () => {
      testComponent.modalOptions = {
        backdrop: false
      };

      openBtn.dispatchEvent(new Event('click'));

      const backdrop = document.body.querySelector('.is-modal__backdrop');
      expect(backdrop).toBe(null);
    });

    it('should close modal on click on backdrop if backdrop is not static in modal options', fakeAsync(() => {
      testComponent.modalOptions = {
        backdrop: true
      };

      openBtn.dispatchEvent(new Event('click'));

      let closeReason;
      testComponent.modalRef.onClose.subscribe((reason) => {
        closeReason = reason;
      });

      const backdrop = document.body.querySelector('.is-modal__backdrop');
      backdrop.dispatchEvent(new Event('click'));

      tick(100);
      expect(closeReason).toBe(IsModalDismissReasons.BACKDROP_CLICK);
    }));

    it('should render content', () => {
      openBtn.dispatchEvent(new Event('click'));
      const content = document.body.querySelector('.is-modal__content');
      expect(content).not.toBe(null);
    });

    it('should render small content if size is small', () => {
      testComponent.modalOptions = {
        size: IsModalSize.Small
      };
      openBtn.dispatchEvent(new Event('click'));

      const content = document.body.querySelector('.is-modal__content');
      expect(content.classList.contains('is-modal__content--small')).toBeTruthy();
    });

    it('should render large content if size is large', () => {
      testComponent.modalOptions = {
        size: IsModalSize.Large
      };
      openBtn.dispatchEvent(new Event('click'));

      const content = document.body.querySelector('.is-modal__content');
      expect(content.classList.contains('is-modal__content--large')).toBeTruthy();
    });

    it('should render template', () => {
      openBtn.dispatchEvent(new Event('click'));
      const template = document.body.querySelector('.is-modal__template');
      expect(template).not.toBe(null);
    });

    it('should close modal on esc key', fakeAsync(() => {
      openBtn.dispatchEvent(new Event('click'));

      let closeReason;
      testComponent.modalRef.onClose.subscribe((reason) => {
        closeReason = reason;
      });

      const template = document.body.querySelector('.is-modal__template');
      const event = new KeyboardEvent('keyup', {
        'key': 'Escape'
      });
      template.dispatchEvent(event);

      tick(100);
      expect(closeReason).toBe(IsModalDismissReasons.ESC);
    }));

    describe('close', () => {
      it('should update animation state of content to out on closing', () => {
        openBtn.dispatchEvent(new Event('click'));

        let content = document.body.querySelector('.is-modal__content');
        expect(content.classList.contains('ng-animating')).toBeFalsy();

        const closeBtn = document.body.querySelector('button.close-btn');
        closeBtn.dispatchEvent(new Event('click'));

        content = document.body.querySelector('.is-modal__content');
        expect(content.classList.contains('ng-animating')).toBeTruthy();
      });

      it('should emit onClose event', fakeAsync(() => {
        openBtn.dispatchEvent(new Event('click'));

        let closeReason;
        testComponent.modalRef.onClose.subscribe((reason) => {
          closeReason = reason;
        });

        const closeBtn = document.body.querySelector('button.close-btn');
        closeBtn.dispatchEvent(new Event('click'));

        tick(100);
        expect(closeReason).toBe('Click on Close');
      }));

      it('should destroy itself', fakeAsync(() => {
        openBtn.dispatchEvent(new Event('click'));

        const detachSpy = spyOn(testComponent.modalService['contentPortal'], 'detach');
        const closeBtn = document.body.querySelector('button.close-btn');
        closeBtn.dispatchEvent(new Event('click'));

        tick(100);

        expect(detachSpy).toHaveBeenCalled();
      }));
    });

    it('should set focus to saved element on destroy if element exists', fakeAsync(() => {
      const elementToFocus = <HTMLElement> document.body.querySelector('input[type=text]');
      elementToFocus.focus();

      openBtn.dispatchEvent(new Event('click'));

      const closeBtn = document.body.querySelector('button.close-btn');
      closeBtn.dispatchEvent(new Event('click'));

      tick(100);

      expect(document.activeElement).toEqual(elementToFocus);
    }));

    it('should set focus to body on destroy if element with focus does not exists', fakeAsync(() => {
      const elementToFocus = <HTMLElement> document.body.querySelector('input[type=text]');
      elementToFocus.focus();

      openBtn.dispatchEvent(new Event('click'));

      testComponentHTML.removeChild(elementToFocus);

      const closeBtn = <HTMLButtonElement> document.body.querySelector('button.close-btn');
      closeBtn.dispatchEvent(new Event('click'));
      // need to clean dom. its not happening automatically in test environement
      document.body.removeChild(document.body.querySelector('.is-modal'));

      tick(100);

      expect(document.activeElement).toEqual(document.body);
    }));

    it('should add custom class to the component if modal options has custom class', () => {
      testComponent.modalOptions = {
        customClass: 'custom-class'
      };
      openBtn.dispatchEvent(new Event('click'));

      const modal = document.body.querySelector('.is-modal');
      expect(modal.classList.contains('custom-class')).toBeTruthy();
    });
  });
});

@Component({
  template: `
  <input type="text" />
  <button type="button"
          class="open-btn"
          (click)="openTemplateModal(basicTemplate)">
    Open Modal
  </button>
  ${apiRef.basicTemplateHTML}
  `
})
class BasicModalComponent {
  modalRef;
  modalOptions = {};

  constructor( public modalService: IsModalService ) {}

  openTemplateModal( template: TemplateRef<any> ): void {
    this.modalRef = this.modalService.open(template, this.modalOptions);
  }
}
