import {
  Component,
  NO_ERRORS_SCHEMA,
  ViewChild
} from '@angular/core';
import {
  TestBed,
  async,
  inject
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlatformModule, Platform } from '@angular/cdk/platform';

import {
  BODY_TOKEN,
  DOCUMENT_TOKEN,
  IsMouseUpService
} from '../core/index';
import {
  IsToolTipModule,
  IsToolTipDirective,
  IsTooltipPosition
} from './index';

let fixture: any;

let el: any;

let tooltipEl: any;

let tooltipFixture: any;

let component: any;

describe('IsToolTip', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IsToolTipModule,
        BrowserAnimationsModule,
        PlatformModule
      ],
      declarations: [
        DefaultTooltipController,
        BottomLeftTooltipController,
        BottomRightTooltipController,
        TooltipErrorController,
        WarnTooltipController,
        HTMLTooltipController,
        TooltipOnInputFocusController,
        TooltipOnClickController,
        CustomTooltipController,
        DisableTooltipController,
        ManualTooltipController
      ],
      providers: [
        IsMouseUpService,
        { provide: BODY_TOKEN, useValue: document.body },
        { provide: DOCUMENT_TOKEN, useValue: document }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  function setValues(controller) {
    fixture = TestBed.createComponent(controller);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tooltipFixture = fixture.debugElement.query(By.directive(IsToolTipDirective));
  }

  describe('Basic Tooltip', () => {
    beforeEach(() => {
      setValues(DefaultTooltipController);
    });

    it('should create the component with default tooltip styles', (() => {
      expect(tooltipFixture).not.toBe(null);
      const tooltipDirective = tooltipFixture.injector.get(IsToolTipDirective);
      expect(tooltipDirective.isToolTip).toEqual('This is a tooltip');
      expect(tooltipDirective.isToolTipPlacement).toEqual(IsTooltipPosition.Top);
      el = tooltipFixture.nativeElement;
      el.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      expect(tooltipDirective.tooltip).toBeDefined();
      expect(tooltipDirective.tooltip.className.trim()).toEqual('is-tooltip--top');

      fixture.whenStable().then(() => {
        tooltipEl = el.parentElement.querySelector('.is-tooltip');
        expect(tooltipEl.classList.contains('is-tooltip--top')).toBe(true);

        el.dispatchEvent(new Event('mouseleave'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          tooltipEl = el.parentElement.querySelector('.is-tooltip');
          expect(tooltipEl).toBe(null);
        });
      });
    }));

    it('should not show tooltip by triggering manually', (() => {
      expect(tooltipFixture).not.toBe(null);
      const tooltipDirective = tooltipFixture.injector.get(IsToolTipDirective);
      expect(tooltipDirective.isToolTip).toEqual('This is a tooltip');
      expect(tooltipDirective.isToolTipPlacement).toEqual(IsTooltipPosition.Top);
      el = tooltipFixture.nativeElement;
      tooltipDirective.showToolTip();
      fixture.detectChanges();
      expect(tooltipDirective.tooltip).not.toBeDefined();
    }));
  });

  describe('Bottom Left Tooltip', () => {
    beforeEach(() => {
      setValues(BottomLeftTooltipController);
    });

    it('should create the component with bottom left tooltip', (() => {
      expect(tooltipFixture).not.toBe(null);
      const tooltipDirective = tooltipFixture.injector.get(IsToolTipDirective);
      expect(tooltipDirective.isToolTip).toEqual('This is a bottom left tooltip');
      expect(tooltipDirective.isToolTipPlacement).toEqual(IsTooltipPosition.BottomLeft);
      el = tooltipFixture.nativeElement;
      el.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();

      expect(tooltipDirective.tooltip).toBeDefined();
      expect(tooltipDirective.tooltip.className.trim()).toEqual('is-tooltip--bottomleft');

      fixture.whenStable().then(() => {
        tooltipEl = el.parentElement.querySelector('.is-tooltip');
        expect(tooltipEl.classList.contains('is-tooltip--bottomleft')).toBe(true);

        el.dispatchEvent(new Event('mouseleave'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          tooltipEl = el.parentElement.querySelector('.is-tooltip');
          expect(tooltipEl).toBe(null);
        });
      });
    }));
  });

  describe('Bottom Right Tooltip', () => {
    beforeEach(() => {
      setValues(BottomRightTooltipController);
    });

    it('should create the component with bottom right tooltip', (() => {
      expect(tooltipFixture).not.toBe(null);
      const tooltipDirective = tooltipFixture.injector.get(IsToolTipDirective);
      expect(tooltipDirective.isToolTip).toEqual('This is a bottom right tooltip');
      expect(tooltipDirective.isToolTipPlacement).toEqual(IsTooltipPosition.BottomRight);
      el = tooltipFixture.nativeElement;
      el.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();

      expect(tooltipDirective.tooltip).toBeDefined();
      expect(tooltipDirective.tooltip.className.trim()).toEqual('is-tooltip--bottomright');

      fixture.whenStable().then(() => {
        tooltipEl = el.parentElement.querySelector('.is-tooltip');
        expect(tooltipEl.classList.contains('is-tooltip--bottomright')).toBe(true);

        el.dispatchEvent(new Event('mouseleave'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          tooltipEl = el.parentElement.querySelector('.is-tooltip');
          expect(tooltipEl).toBe(null);
        });
      });
    }));
  });

  describe('Bottom Right Tooltip', () => {
    beforeEach(() => {
      setValues(WarnTooltipController);
    });

    it('should create the component with bottom placement and trigger touchevents', (() => {
      expect(tooltipFixture).not.toBe(null);
      const tooltipDirective = tooltipFixture.injector.get(IsToolTipDirective);
      expect(tooltipDirective.isToolTip).toEqual('This is my second tooltip');
      expect(tooltipDirective.isToolTipPlacement).toEqual(IsTooltipPosition.Bottom);
      el = tooltipFixture.nativeElement;
      el.dispatchEvent(new Event('touchstart'));
      fixture.detectChanges();

      expect(tooltipDirective.tooltip).toBeDefined();
      expect(tooltipDirective.tooltip.className.trim()).toEqual('is-tooltip--bottom warn fixed');

      fixture.whenStable().then(() => {
        tooltipEl = el.parentElement.querySelector('.is-tooltip');
        expect(tooltipEl.classList.contains('is-tooltip--bottom')).toBe(true);
        const content = tooltipEl.querySelector('.is-tooltip__content span');
        expect(content.innerHTML).toEqual('This is my second tooltip');

        el.dispatchEvent(new Event('touchend'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          tooltipEl = el.parentElement.querySelector('.is-tooltip');
          expect(tooltipEl).toBe(null);
        });
      });
    }));
  });

  describe('Error with Tooltip', () => {
    beforeEach(() => {
      setValues(TooltipErrorController);
    });

    it('should not show tooltip when tooltip text is missing', (() => {
      expect(tooltipFixture).not.toBe(null);
      const tooltipDirective = tooltipFixture.injector.get(IsToolTipDirective);
      expect(tooltipDirective.isToolTip).toEqual('');
      expect(tooltipDirective.isToolTipPlacement).toEqual(IsTooltipPosition.BottomLeft);
      el = tooltipFixture.nativeElement;
      el.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();

      expect(tooltipDirective.tooltip).not.toBeDefined();
    }));
  });

  describe('HTML Template Tooltip on IE', () => {
    beforeEach(inject([Platform], (iePlatform: Platform) => {
      iePlatform.TRIDENT = true;
      setValues(HTMLTooltipController);
    }));

    it('should create the component with right placement and html tooltip text', (() => {
      expect(tooltipFixture).not.toBe(null);
      const tooltipDirective = tooltipFixture.injector.get(IsToolTipDirective);
      expect(tooltipDirective.isToolTip).toEqual(`Add some <b>Bold</b> or <i class='text-primary'>colorful</i> tooltips`);
      expect(tooltipDirective.isToolTipPlacement).toEqual(IsTooltipPosition.Right);
      el = tooltipFixture.nativeElement;
      el.dispatchEvent(new Event('pointerenter'));
      fixture.detectChanges();
      expect(tooltipDirective.tooltip).toBeDefined();
      expect(tooltipDirective.tooltip.className.trim()).toEqual('is-tooltip--right info');

      fixture.whenStable().then(() => {
        tooltipEl = el.parentElement.querySelector('.is-tooltip');
        expect(tooltipEl.classList.contains('is-tooltip--right')).toBe(true);
        const content = tooltipEl.querySelector('.is-tooltip__content span');
        expect(content.innerHTML).toEqual(`Add some <b>Bold</b> or <i class="text-primary">colorful</i> tooltips`);

        el.dispatchEvent(new Event('pointerleave'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          tooltipEl = el.parentElement.querySelector('.is-tooltip');
          expect(tooltipEl).toBe(null);
        });
      });
    }));
  });

  describe('Tooltip on Focus', () => {
    beforeEach(() => {
      setValues(TooltipOnInputFocusController);
    });

    it('should show the tooltip on input focus', (() => {
      expect(tooltipFixture).not.toBe(null);
      const tooltipDirective = tooltipFixture.injector.get(IsToolTipDirective);
      expect(tooltipDirective.isToolTip).toEqual(`Should contain at least 1 digit`);
      expect(tooltipDirective.isToolTipPlacement).toEqual(IsTooltipPosition.Left);
      el = tooltipFixture.nativeElement;
      el.dispatchEvent(new Event('focusin'));
      fixture.detectChanges();

      expect(tooltipDirective.tooltip).toBeDefined();
      expect(tooltipDirective.tooltip.className.trim()).toEqual('is-tooltip--left');

      fixture.whenStable().then(() => {
        tooltipEl = el.parentElement.querySelector('.is-tooltip');
        expect(tooltipEl.classList.contains('is-tooltip--left')).toBe(true);
        const content = tooltipEl.querySelector('.is-tooltip__content span');
        expect(content.innerHTML).toEqual(`Should contain at least 1 digit`);

        el.dispatchEvent(new Event('focusout'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          tooltipEl = el.parentElement.querySelector('.is-tooltip');
          expect(tooltipEl).toBe(null);
        });
      });
    }));
  });

  describe('Tooltip on Click', () => {
    beforeEach(() => {
      setValues(TooltipOnClickController);
    });

    it('should show the tooltip on div click', (() => {
      expect(tooltipFixture).not.toBe(null);
      const tooltipDirective = tooltipFixture.injector.get(IsToolTipDirective);
      expect(tooltipDirective.isToolTip).toEqual(`Top Right`);
      expect(tooltipDirective.isToolTipPlacement).toEqual(IsTooltipPosition.TopRight);
      el = tooltipFixture.nativeElement;
      el.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      expect(tooltipDirective.tooltip).toBeDefined();
      expect(tooltipDirective.tooltip.className.trim()).toEqual('is-tooltip--topright');

      fixture.whenStable().then(() => {
        tooltipEl = el.parentElement.querySelector('.is-tooltip');
        expect(tooltipEl.classList.contains('is-tooltip--topright')).toBe(true);
        const content = tooltipEl.querySelector('.is-tooltip__content span');
        expect(content.innerHTML).toEqual(`Top Right`);

        document.dispatchEvent(new Event('mouseup'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          tooltipEl = el.parentElement.querySelector('.is-tooltip');
          expect(tooltipEl).toBe(null);
        });
      });
    }));
  });

  describe('Custom Tooltip', () => {
    beforeEach(() => {
      setValues(CustomTooltipController);
    });

    it('should create the component with custom tooltip', (() => {
      expect(tooltipFixture).not.toBe(null);
      const tooltipDirective = tooltipFixture.injector.get(IsToolTipDirective);
      expect(tooltipDirective.isToolTip).toEqual(`empty`);
      expect(tooltipDirective.istoolTipData).toEqual({ title: 'Custom Tooltip' });
      expect(tooltipDirective.istoolTipTemplate).toBeDefined();
      expect(tooltipDirective.isToolTipPlacement).toEqual(IsTooltipPosition.TopLeft);

      el = tooltipFixture.nativeElement;
      el.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();

      expect(tooltipDirective.tooltip).toBeDefined();
      expect(tooltipDirective.tooltip.toolTipTemplate).toBeDefined();
      expect(tooltipDirective.tooltip.className.trim()).toEqual('is-tooltip--topleft light');

      fixture.whenStable().then(() => {
        tooltipEl = el.parentElement.querySelector('.is-tooltip');
        expect(tooltipEl.classList.contains('is-tooltip--topleft')).toBe(true);
        const content = tooltipEl.querySelector('.is-tooltip__content .text-uppercase');
        expect(content.innerHTML).toEqual(`Custom Tooltip`);

        el.dispatchEvent(new Event('mouseleave'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          tooltipEl = el.parentElement.querySelector('.is-tooltip');
          expect(tooltipEl).toBe(null);
        });
      });
    }));
  });

  describe('Manual Tooltip', () => {
    beforeEach(() => {
      setValues(ManualTooltipController);
    });

    it('should show the tooltip manually', (() => {
      expect(tooltipFixture).not.toBe(null);
      const tooltipDirective = tooltipFixture.injector.get(IsToolTipDirective);
      expect(tooltipDirective.isToolTip).toEqual(`Tooltip`);
      el = tooltipFixture.nativeElement;
      component.myTooltip.show();
      fixture.detectChanges();

      expect(tooltipDirective.tooltip).toBeDefined();
      expect(tooltipDirective.tooltip.className.trim()).toEqual('is-tooltip--top');

      fixture.whenStable().then(() => {
        tooltipEl = el.parentElement.querySelector('.is-tooltip');
        expect(tooltipEl.classList.contains('is-tooltip--top')).toBe(true);
        component.active = false;
      });
    }));
  });

  describe('Disabled Tooltip', () => {
    beforeEach(() => {
      setValues(DisableTooltipController);
    });

    it('should not show tooltip when disabled', async(() => {
      expect(tooltipFixture).not.toBe(null);
      const tooltipDirective = tooltipFixture.injector.get(IsToolTipDirective);
      expect(tooltipDirective.isToolTip).toEqual('Tooltip');
      expect(tooltipDirective.isToolTipPlacement).toEqual(IsTooltipPosition.Top);
      el = tooltipFixture.nativeElement;
      el.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();

      expect(tooltipDirective.tooltip).not.toBeDefined();
    }));
  });
});

@Component({
  template: `
    <div
      isToolTip="This is a tooltip"
      isToolTipPlacement="top">
    </div>`
})
class DefaultTooltipController { }

@Component({
  template: `
    <div
      isToolTip="This is a bottom left tooltip"
      isToolTipPlacement="bottomleft">
    </div>`
})
class BottomLeftTooltipController { }

@Component({
  template: `
    <div
      isToolTip="This is a bottom right tooltip"
      isToolTipPlacement="bottomright">
    </div>`
})
class BottomRightTooltipController {
}

@Component({
  template: `
    <div
      isToolTip
      isToolTipPlacement="bottomleft">
    </div>`
})
class TooltipErrorController {
}

@Component({
  template: `
    <div
      isToolTip="This is my second tooltip"
      isToolTipPlacement="bottom"
      [isToolTipFixed]="true"
      isToolTipColor="warn">
    </div>`
})
class WarnTooltipController { }

@Component({
  template: `
    <div isToolTip="Add some <b>Bold</b> or <i class='text-primary'>colorful</i> tooltips"
         isToolTipPlacement="right"
         isToolTipColor="info">
    </div>`
})
class HTMLTooltipController { }

@Component({
  template: `
    <form>
      <div class="form-group">
        <label for="formGroupInput">Password</label>
        <input type="text"
               class="form-control"
               id="formGroupInput"
               placeholder="Enter Password"
               isToolTipFocus="true"
               isToolTip="Should contain at least 1 digit"
               isToolTipPlacement="left">
      </div>
    </form>`
})
class TooltipOnInputFocusController { }

@Component({
  template: `
    <div class="tooltip-box"
         isToolTipShowOnClick="true"
         isToolTip="Top Right"
         isToolTipPlacement="topright">
      <p>Click Me</p>
    </div>`
})
class TooltipOnClickController { }

@Component({
  template: `
    <div class="tooltip-box"
         isToolTipColor="light"
         isToolTip="empty"
         [istoolTipTemplate]="tooltipTemplate"
         [istoolTipData]="{title: 'Custom Tooltip'}"
         isToolTipPlacement="topleft">
      <p class="text-center p-3">Tooltip With custom template </p>
    </div>
    <ng-template #tooltipTemplate
                 let-data="data">
      <h5 class="text-uppercase">{{data.title}}</h5>
      <hr>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga
      <is-number-increase class="text-primary font-weight-bold"
                          [value]="2610"></is-number-increase>
      saepe expedita iusto ea et ducimus repellendus necessitatibus
    </ng-template>
  `
})
class CustomTooltipController { }

@Component({
  template: `
    <div
      isToolTip="Tooltip"
      [disabled]="true"
      isToolTipPlacement="top">
    </div>`
})
class DisableTooltipController { }

@Component({
  template: `
  <div class="btn btn-secondary"
       trigger="manual"
       #myToolTip="isToolTip"
       isToolTip="Tooltip"
       *ngIf="active">
  </div>`
})
class ManualTooltipController {
  active = true;
  @ViewChild('myToolTip')
  myTooltip: IsToolTipDirective;
}
