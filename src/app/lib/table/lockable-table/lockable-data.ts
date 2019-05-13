import { AfterContentInit, Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IsTableService } from '../table.service';
import { IsLockableElement } from './lockable-element';

/**
 * Directive for IsTable <td> to make it lockable
 *
 * @export
 */
@Directive({
  selector: 'td[is-lockable-data]',
  host: {
    '[class.is-lockable-data]': 'true'
  }
})
export class IsLockableData extends IsLockableElement implements AfterContentInit, OnDestroy {

  /**
   * Constructor
   * @param element
   * @param rowRenderer
   * @param service
   */
  constructor( protected element: ElementRef,
               protected rowRenderer: Renderer2,
               private service: IsTableService ) {
    super(element, rowRenderer);
  }

  /**
   * If this directive is active
   *
   * @memberof IsLockableData
   */
  isSetup = false;

  /**
   * Subscription for disable features subscription
   *
   * @memberof IsLockableData
   */
  disableFeaturesSubscription: Subscription;

  /**
   * After content init
   */
  ngAfterContentInit(): void {
    this.disableFeaturesSubscription = this.service.$shouldDisableFeatures.subscribe(
      shouldDisable => {
        if (shouldDisable && this.isSetup) {
          this.teardown();
        }
        if (!shouldDisable && !this.isSetup) {
          this.setup();
        }
      }
    );
  }

  /**
   * Disables this directive
   *
   * @protected
   * @memberof IsLockableData
   */
  protected teardown() {
    this.isSetup = false;
    this.adjustStyles(false);
  }

  /**
   * Enables this directive
   *
   * @protected
   * @memberof IsLockableData
   */
  protected setup() {
    this.isSetup = true;
  }

  /**
   * Add or remove styling for locked/unlocked elements
   * @param locked
   */
  adjustStyles(locked: boolean) {
    const styles = Object.assign({}, this.defaultStyles, this.styles);
    const el = this.element.nativeElement;

    if (locked) {
      this.setStyle(el, styles);
      this.renderer.addClass(el, 'is-lockable-data--locked');
    } else {
      this.removeStyles(el, styles);
      this.renderer.removeClass(el, 'is-lockable-data--locked');
    }
  }

  /**
   * Cleanup when directive is destroyed
   *
   * @memberof IsLockableData
   */
  ngOnDestroy() {
    if (this.disableFeaturesSubscription) {
      this.disableFeaturesSubscription.unsubscribe();
    }
  }
}
