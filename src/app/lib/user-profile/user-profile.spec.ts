import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { IsUserProfileModule, IsUserProfile, IsUserProfilePlacement } from './index';

describe('IsUserProfile', () => {
  let userProfile: IsUserProfile;
  const testUserName = 'John Doe';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        IsUserProfileModule.forRoot(),
        NgbDropdownModule.forRoot()
      ],
      declarations: [
        TestUserProfileWithCustomOptions,
        TestUserProfileWithDefaults,
        TestUserProfileWithInvalidImage
      ]
    }).compileComponents();
  });

  describe('defaults', () => {
    let fixture: ComponentFixture<TestUserProfileWithDefaults>;
    let testComponent: TestUserProfileWithDefaults;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestUserProfileWithDefaults);
      testComponent = fixture.componentInstance;
      fixture.detectChanges();

      const userProfileDE: DebugElement = fixture.debugElement.query(By.directive(IsUserProfile));
      userProfile = userProfileDE.componentInstance;
      spyOn(userProfile, 'hideImage').and.callThrough();
    });

    it('has user name set', () => {
      expect(userProfile.userName).toEqual(testUserName);
    });

    it('has valid image shown', () => {
      expect(userProfile.hideImage).not.toHaveBeenCalled();
    });
  });

  describe('invalid image', () => {
    let fixture: ComponentFixture<TestUserProfileWithInvalidImage>;
    let testComponent: TestUserProfileWithInvalidImage;
    let imageDebugElement: DebugElement;
    let imageElement: HTMLImageElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestUserProfileWithInvalidImage);
      testComponent = fixture.componentInstance;
      fixture.detectChanges();

      const userProfileDE: DebugElement = fixture.debugElement.query(By.directive(IsUserProfile));
      userProfile = userProfileDE.componentInstance;
      spyOn(userProfile, 'hideImage').and.callThrough();
      imageDebugElement = fixture.debugElement.query(By.css('img'));
      imageElement = imageDebugElement.nativeElement;
    });

    it('displays invalid image on error', async(() => {
      imageDebugElement.triggerEventHandler('error', null);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(userProfile.hideImage).toHaveBeenCalled();
        expect(imageElement.src).toContain('invalid/path');
      });
    }));
  });

  describe('customize', () => {
    let fixture: ComponentFixture<TestUserProfileWithCustomOptions>;
    let testComponent: TestUserProfileWithCustomOptions;
    let divDebugElement: DebugElement;
    let divElement: HTMLImageElement;
    let spanDebugElement: DebugElement;
    let spanElement: HTMLImageElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestUserProfileWithCustomOptions);
      testComponent = fixture.componentInstance;
      fixture.detectChanges();

      const userProfileDE: DebugElement = fixture.debugElement.query(By.directive(IsUserProfile));
      userProfile = userProfileDE.componentInstance;
      spyOn(userProfile, 'hideImage').and.callThrough();
      divDebugElement = fixture.debugElement.query(By.css('div.d-flex'));
      divElement = divDebugElement.nativeElement;
      spanDebugElement = fixture.debugElement.query(By.css('span'));
      spanElement = divDebugElement.nativeElement;
    });

    it('can place avatar on left', () => {
      fixture.detectChanges();
      const element = fixture.debugElement.query(By.css('.is-user-profile__wrapper')).nativeElement;
      expect(element.classList).toContain('flex-row-reverse');
      userProfile.avatarPlacement = IsUserProfilePlacement.Right;
      fixture.detectChanges();
      expect(element.classList).not.toContain('flex-row-reverse');
    });

    it('can customize welcome message', () => {
      fixture.detectChanges();
      expect(spanElement.textContent).toContain('You are logged in as , John Doe');
      userProfile.welcomeMessage = 'Welcome again';
      fixture.detectChanges();
      expect(spanElement.textContent).not.toContain('You are logged in as , John Doe');
    });

    it('can hide welcome message', () => {
      userProfile.showMessage = false;
      fixture.detectChanges();
      expect(spanElement.textContent).toContain('');
    });
  });
});

/**
 * Test component for defaults
 */
@Component({
  template: `<is-user-profile
  [userName]="'John Doe'"
  [image]="'http://www.wpclipart.com/signs_symbol/icons_oversized/male_user_icon.png'">
</is-user-profile>`
})
class TestUserProfileWithDefaults {}

/**
 * Test component for invalid image
 */
@Component({
  template: `<is-user-profile
  [userName]="'John Doe'"
  [image]="'invalid/path'">
</is-user-profile>`
})
class TestUserProfileWithInvalidImage {}

/**
 * Test component for avatar on left, custom message and hidden message
 */
@Component({
  template: `<is-user-profile
  [avatarPlacement]= "'left'"
  [welcomeMessage]= "'You are logged in as '"
  [userName]="'John Doe'"
  [image]="'invalid/path'">
</is-user-profile>`
})
class TestUserProfileWithCustomOptions {}


