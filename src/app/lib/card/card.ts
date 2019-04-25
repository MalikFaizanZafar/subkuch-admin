import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Directive,
  Input,
  OnChanges,
  HostBinding,
  SimpleChanges,
  SimpleChange,
} from '@angular/core';

/**
 * DF Card Header
 */
@Directive({
  selector: 'is-card-header, [is-card-header]',
  host: { 'class': 'is-card__header' }
})
export class IsCardHeader { }

/**
 * DF Card Title
 */
@Directive({
  selector: 'is-card-title, [is-card-title]',
  host: { 'class': 'is-card__title' }
})
export class IsCardTitle { }

/**
 * DF Card Header Button
 */
@Directive({
  selector: '[is-card-header-button]',
  host: { 'class': 'is-card__header__button' }
})
export class IsCardHeaderButton { }

/**
 * DF Card Feature Image
 */
@Directive({
  selector: '[is-card-image]',
  host: { 'class': 'is-card__image' }
})
export class IsCardImage { }

/**
 * DF Card Avatar
 */
@Directive({
  selector: 'is-card-avatar',
  host: {
    'class': 'is-card__avatar'
  }
})
export class IsCardAvatar implements OnChanges {
  /**
   * URL of the background image
   */
  @Input('src')
  src: string;

  /**
   * Background image style binding
   */
  @HostBinding('style.background-image')
  bgImage: string;

  /**
   * Lifecycle hook executed on 'src' change
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.src) {
      const src: SimpleChange = changes.src;
      this.bgImage = `url(${src.currentValue})`;
    }
  }
}

/**
 * DF Card Content
 */
@Directive({
  selector: 'is-card-content, [is-card-content]',
  host: { 'class': 'is-card__content' }
})
export class IsCardContent { }

/**
 * DF Card Footer
 */
@Directive({
  selector: 'is-card-footer, [is-card-footer]',
  host: { 'class': 'is-card__footer' }
})
export class IsCardFooter { }

/**
 * DF Card Main Container
 */
@Component({
  selector: 'is-card',
  templateUrl: 'card.html',
  styleUrls: ['card.scss'],
  host: { 'class': 'is-card' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsCard { }
