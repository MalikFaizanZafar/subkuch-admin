
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  DebugElement
} from '@angular/core';
import {
  ComponentFixture,
  async,
  TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IsBadge } from './badge';
import { IsPlacement } from '../core/shared/model/placement';
import { IsTheme } from '../core/shared/model/theme';

describe('IsBadge', () => {
  let fixture: ComponentFixture<any>;
  let testComponent: DefaultBadge;
  let badge: IsBadge;
  let divElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule
      ],
      declarations: [
        IsBadge,
        SingleBadge,
        DefaultBadge
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    TestBed.compileComponents();
  }));

  describe('defaults', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(DefaultBadge);
      testComponent = fixture.debugElement.componentInstance;
      fixture.detectChanges();
      const badgeDebug: DebugElement = fixture.debugElement.query(
        By.directive(IsBadge)
      );
      badge = badgeDebug.componentInstance;
      divElement = fixture.debugElement.query(By.css('div')).nativeElement;
    });

    it('placement is on top right', () => {
      expect(badge.placement).toBe(IsPlacement.TopRight);
      expect(divElement.classList).toContain('is-badge--top-right');
    });

    it('count is set', () => {
      expect(badge.count).toEqual(0);
      expect(badge.runAnimation).toEqual('');
      expect(divElement.innerText).toEqual('0');
      expect(divElement.classList).toContain('ng-trigger-badgeAnimation');
    });

    it('theme is danger', () => {
      expect(badge.theme).toEqual(IsTheme.Danger);
      expect(divElement.classList).toContain('is-badge--danger');
    });
  });

  describe('non defaults', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SingleBadge);
      testComponent = fixture.debugElement.componentInstance;
      fixture.detectChanges();

      const badgeDebug: DebugElement = fixture.debugElement.query(
        By.directive(IsBadge)
      );
      badge = badgeDebug.componentInstance;
      divElement = fixture.debugElement.query(By.css('div')).nativeElement;
    });

    describe('placements are', () => {
      it('on top right', () => {
        expect(badge.placement).toBe(IsPlacement.TopRight);
      });

      it('on top left', () => {
        badge.placement = IsPlacement.TopLeft;
        fixture.detectChanges();
        expect(badge.placement).toBe(IsPlacement.TopLeft);

        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(divElement.classList).toContain('is-badge--top-left');
        });
      });

      it('on bottom right', () => {
        badge.placement = IsPlacement.BottomRight;
        fixture.detectChanges();
        expect(badge.placement).toBe(IsPlacement.BottomRight);

        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(divElement.classList).toContain('is-badge--bottom-right');
        });
      });

      it('on bottom left', () => {
        badge.placement = IsPlacement.BottomLeft;
        fixture.detectChanges();
        expect(badge.placement).toBe(IsPlacement.BottomLeft);

        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(divElement.classList).toContain('is-badge--bottom-left');
        });
      });
    });

    describe('counter', () => {
      it('increments', () => {
        const currentCount: number = badge.count;
        badge.count++;
        fixture.detectChanges();
        expect(badge.count).toEqual(currentCount + 1);
        expect(divElement.classList).not.toContain('ng-animating');
        expect(badge.runAnimation).toEqual('in');

        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(badge.runAnimation).toEqual('');
          expect(+divElement.innerText).toEqual(currentCount + 1);
          expect(divElement.classList).toContain('ng-animating');
        });
      });

      it('decrements', () => {
        const currentCount: number = badge.count;
        badge.count--;
        fixture.detectChanges();
        expect(badge.count).toEqual(currentCount - 1);
        expect(divElement.classList).not.toContain('ng-animating');
        expect(badge.runAnimation).toEqual('in');

        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(badge.runAnimation).toEqual('');
          expect(+divElement.innerText).toEqual(currentCount - 1);
          expect(divElement.classList).toContain('ng-animating');
        });
      });

      it('cannot decrement below 0', () => {
        badge.count = 0;
        badge.count--;
        fixture.detectChanges();
        expect(badge.count).toEqual(0);
        expect(divElement.classList).not.toContain('ng-animating');

        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(+divElement.innerText).toEqual(0);
          expect(divElement.classList).toContain('ng-animating');
        });
      });
    });

    describe('theme', () => {
      it('is set to danger', () => {
        badge.theme = IsTheme.Danger;
        fixture.detectChanges();
        expect(badge.theme).toBe(IsTheme.Danger);

        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(divElement.classList).toContain('is-badge--danger');
        });
      });

      it('is set to primary', () => {
        badge.theme = IsTheme.Primary;
        fixture.detectChanges();
        expect(badge.theme).toBe(IsTheme.Primary);

        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(divElement.classList).toContain('is-badge--primary');
        });
      });

      it('is set to success', () => {
        badge.theme = IsTheme.Success;
        fixture.detectChanges();
        expect(badge.theme).toBe(IsTheme.Success);

        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(divElement.classList).toContain('is-badge--success');
        });
      });

      it('is set to warning', () => {
        badge.theme = IsTheme.Warning;
        fixture.detectChanges();
        expect(badge.theme).toBe(IsTheme.Warning);

        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(divElement.classList).toContain('is-badge--warning');
        });
      });
    });
  });
});

/** test components for testing badge */
@Component({
  template: `<is-badge></is-badge>`
})
class DefaultBadge {
}

@Component({
  template: `<is-badge [count]="count" [placement]="placement" [theme]="theme">
  </is-badge>`
})
class SingleBadge {
  count = 1;
  placement: IsPlacement = IsPlacement.TopRight;
  theme: IsTheme = IsTheme.Danger;
}
