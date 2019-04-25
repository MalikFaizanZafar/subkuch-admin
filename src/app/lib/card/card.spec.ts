import { Component, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  IsCardModule,
  IsCard,
  IsCardHeader,
  IsCardAvatar,
  IsCardTitle,
  IsCardHeaderButton,
  IsCardContent,
  IsCardImage,
  IsCardFooter
} from './index';

describe('IsCard', () => {
  let fixture: ComponentFixture<any>;
  let cardNativeElement: HTMLElement;
  let cardDebugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IsCardModule.forRoot()],
      declarations: [
        SimpleCard,
        CardWithHeader,
        CardWithContent,
        CardWithFooter,
        SimpleThemeCard
      ]
    });

    TestBed.compileComponents();
  });

  describe('simple card', () => {
    beforeEach(() => {
      initFixture(SimpleCard);
    });

    it('has cards class', () => {
      fixture.detectChanges();
      expect(cardNativeElement.classList).toContain('is-card');
    });
  });

  describe('card with header', () => {
    let headerElement: HTMLElement;

    beforeEach(() => {
      initFixture(CardWithHeader);
      headerElement = cardDebugElement.query(By.directive(IsCardHeader)).nativeElement;
    });

    it('has card header', () => {
      fixture.detectChanges();
      expect(headerElement.classList).toContain('is-card__header');
    });

    describe('with avatar', () => {
      let avatar: IsCardAvatar;
      let avatarElement: HTMLElement;

      beforeEach(() => {
        const debugElement: DebugElement = cardDebugElement.query(By.directive(IsCardAvatar));
        avatarElement = debugElement.nativeElement;
        avatar = debugElement.injector.get(IsCardAvatar) as IsCardAvatar;
      });

      it('sets avatar images', () => {
        fixture.detectChanges();
        expect(avatarElement.classList).toContain('is-card__avatar');
        expect(avatar.src).toEqual('test.jpg');
        expect(avatar.bgImage).toEqual('url(test.jpg)');
      });

      it('changing component background image changes host elements background image', () => {
        avatar.bgImage = 'url("newtest.jpg")';
        fixture.detectChanges();
        expect(avatarElement.style.getPropertyValue('background-image')).toEqual('url("newtest.jpg")');
      });
    });

    describe('with title', () => {
      let titleElement: HTMLElement;

      beforeEach(() => {
        const debugElement: DebugElement = cardDebugElement.query(By.directive(IsCardTitle));
        titleElement = debugElement.nativeElement;
      });

      it('sets title', () => {
        expect(titleElement.classList).toContain('is-card__title');
      });
    });

    describe('with header button', () => {
      let headerButtonElement: HTMLButtonElement;

      beforeEach(() => {
        const debugElement: DebugElement = cardDebugElement.query(By.directive(IsCardHeaderButton));
        headerButtonElement = debugElement.nativeElement;
      });

      it('sets title', () => {
        expect(headerButtonElement.classList).toContain('is-card__header__button');
      });
    });

    describe('with header title', () => {
      let titleElement: HTMLElement;

      beforeEach(() => {
        const debugElement: DebugElement = cardDebugElement.query(By.directive(IsCardTitle));
        titleElement = debugElement.nativeElement;
      });

      it('sets title', () => {
        expect(titleElement.classList).toContain('is-card__title');
      });
    });
  });

  describe('card with content/body', () => {
    let contentElement: HTMLElement;
    let imgElement: HTMLImageElement;

    beforeEach(() => {
      initFixture(CardWithContent);
      const debugElement: DebugElement = cardDebugElement.query(By.directive(IsCardContent));
      contentElement = debugElement.nativeElement;

      const imgDebugElement: DebugElement = debugElement.query(By.directive(IsCardImage));
      imgElement = imgDebugElement.nativeElement;
    });

    it('sets title', () => {
      expect(contentElement.classList).toContain('is-card__content');
    });

    it('sets image', () => {
      expect(imgElement.classList).toContain('is-card__image');
    });
  });

  describe('card with footer', () => {
    let footerElement: HTMLButtonElement;

    beforeEach(() => {
      initFixture(CardWithFooter);
      const debugElement: DebugElement = cardDebugElement.query(By.directive(IsCardFooter));
      footerElement = debugElement.nativeElement;
    });

    it('sets title', () => {
      expect(footerElement.classList).toContain('is-card__footer');
    });
  });

  describe('card with theme', () => {
    beforeEach(() => {
      initFixture(SimpleThemeCard);
    });

    it('sets theme', () => {
      expect(cardNativeElement.classList).toContain('is-card--primary');
    });
  });
  /**
   * helper function to initialize fixture
   * @param component
   */
  function initFixture(component: any) {
    fixture = TestBed.createComponent(component);
    fixture.detectChanges();

    cardDebugElement = fixture.debugElement;
    cardNativeElement = cardDebugElement.query(By.directive(IsCard)).nativeElement;
  }
});

// test components
// 1. simple card
@Component({
  template: '<is-card><h1>Simple Card</h1></is-card>'
})
class SimpleCard { }

// 2. card with header
@Component({
  template: `<is-card>
    <is-card-header>
    <button is-card-header-button class="mr-2">
      <i class="fa fa-arrow-left"></i>
    </button>

    <is-card-avatar class="mr-3" src="test.jpg">
    </is-card-avatar>

    <is-card-title>
      <p class="mb-0 is-card--ellipsis">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      </p>
      <small class="text-muted"> Subtitle </small>
    </is-card-title>
    <button is-card-header-button>
      <i class="text-warning fa fa-star"></i>
    </button>

    </is-card-header>
  </is-card>`
})
class CardWithHeader { }

// 3. card with body/content
@Component({
  template: `<is-card>
    <is-card-content>
      <img is-card-image src="test.jpg">
      <h5>Card With Multiple Sections</h5>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
    </is-card-content>
  </is-card>`
})
class CardWithContent { }

// 3. card with footer
@Component({
  template: `<is-card>
    <is-card-footer>
      <span>This is footer</span>
      <button class="ml-auto" type="button"> Action </button>
    </is-card-footer>
  </is-card>`
})
class CardWithFooter { }

// 4. simple theme card
@Component({
  template: '<is-card class="is-card--primary"></is-card>'
})
class SimpleThemeCard { }
