/**
 * Created by egonzalez<edgard.gonzalez@aurea.com> on 07/11/2017.
 */
import { Component, HostListener } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Input } from '@angular/core';
import { EventEmitter } from '@angular/core';

/**
 * Component creates lock button
 * Clicking on button locks/unlocks the column
 *
 * @export
 */
@Component({
  selector: 'is-lockable-button',
  templateUrl: './lockable-button.html',
  styleUrls: ['lockable-button.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.is-lockable-button]': 'true'
  }
})
export class IsLockableButton {
  /**
   * Variable that holds the lock state
   */
  @Input()
  locked = false;

  /**
   * On mouse enter Event emitter
   */
  onLock: EventEmitter<any> = new EventEmitter();

  /**
   * Input to iconUnlocked, defaultIcon 'fa fa-lock'
   */
  @Input()
  iconLocked = 'fa fa-lock';

  /**
   * Input to iconUnlocked, defaultIcon 'fa fa-unlock-alt'
   */
  @Input()
  iconUnlocked = 'fa fa-unlock-alt';

  /**
   * Changes the internal state of this column and emits the proper change
   * @param ev
   */
  @HostListener('click', ['$event'])
  handleLock( ev: Event ) {
    ev.stopPropagation();
    this.locked = !this.locked;
    this.onLock.emit(this.locked);
  }
}
