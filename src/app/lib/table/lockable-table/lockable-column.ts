import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal';
import {
  AfterContentInit,
  ApplicationRef,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Injector,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { IsTableService } from '../table.service';
import { IsLockableButton } from './lockable-button/lockable-button';
import { IsLockableElement } from './lockable-element';

/**
 * Directive for IsTable <th> to make it lockable
 *
 * @export
 */
@Directive({
  selector: 'th[is-lockable-column]',
  host: {
    '[class.is-lockable-column]': 'true'
  }
})
export class IsLockableColumn extends IsLockableElement implements
  AfterContentInit,  OnDestroy {

  /**
   * Whether or not column should be locked
   */
  private _locked = false;

  /**
   * Portal used for attaching ResizableColumnDragHandle
   */
  private portal: ComponentPortal<IsLockableButton>;

  /**
   * Host for portal
   */
  private portalHost: DomPortalHost;

  /**
   * IsLockableButton instance
   */
  private buttonInstance: IsLockableButton;

  /**
   * Input to iconUnlocked, defaultIcon 'fa fa-lock'
   */
  @Input() iconLocked = 'fa fa-lock';

  /**
   * Input to iconUnlocked, defaultIcon 'fa fa-unlock-alt'
   */
  @Input() iconUnlocked = 'fa fa-unlock-alt';

  /**
   * Variable that holds the lock state
   */
  @Input()
  get locked(): boolean {
    return this._locked;
  }

  /**
   * Sets locked value
   *
   * @param value
   */
  set locked( value: boolean ) {
    this._locked = coerceBooleanProperty(value);
    this.handleLock(this._locked);
  }

  /**
   * On mouse enter Event emitter
   */
  onLock: EventEmitter<any> = new EventEmitter();

  /**
   * Subject that emits when directive is destroyed
   *
   * @memberof IsLockableColumn
   */
  protected readonly destroy$ = new Subject();

  /**
   * Indicates if this directive is active
   *
   * @memberof IsLockableColumn
   */
  isSetup: boolean;

  /**
   * Getter to add the locked class to the host element
   *
   * @readonly
   * @memberof IsLockableColumn
   */
  @HostBinding('class.is-lockable-column--locked')
  get lockedClass() {
    return this.isSetup && this._locked;
  }

  /**
   * Creates an instance of IsLockableColumn.
   * @param element
   * @param columnRenderer
   * @param componentFactoryResolver
   * @param appRef
   * @param injector
   * @param service
   * @memberof IsLockableColumn
   */
  constructor( public element: ElementRef,
               // tslint:disable-next-line
               private columnRenderer: Renderer2,
               private componentFactoryResolver: ComponentFactoryResolver,
               private appRef: ApplicationRef,
               private injector: Injector,
               private service: IsTableService ) {
    super(element, columnRenderer);
  }

  /**
   * After content init
   */
  ngAfterContentInit(): void {
    this.service.$shouldDisableFeatures
      .pipe(takeUntil(this.destroy$))
      .subscribe(
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
   * On destroy
   */
  ngOnDestroy(): void {
    if (this.portalHost) {
      this.portalHost.detach();
    }
    if (this.destroy$) {
      this.destroy$.next();
      this.destroy$.complete();
    }
  }

  /**
   * Changes the internal state of this column and emits the proper change
   * @param locked
   */
  handleLock( locked: boolean ) {
    this.width = parseFloat(this.element.nativeElement.offsetWidth);
    this._locked = locked;
    if (this.isSetup) {
      this.adjustStyles(locked);
      this.onLock.emit(locked);
    }
  }

  /**
   * Disables the directive
   *
   * @protected
   * @memberof IsLockableColumn
   */
  protected teardown() {
    this.isSetup = false;
    this.adjustStyles(false);
    this.portalHost.detach();
  }

  /**
   * Enables the directive
   *
   * @protected
   * @memberof IsLockableColumn
   */
  protected setup() {
    this.isSetup = true;
    // make sure resize component gets applied before lock component
    requestAnimationFrame(() => {
      // Create a Portal based on the IsLockableButton
      this.portal = new ComponentPortal(IsLockableButton);

      // Create a PortalHost with table column as its anchor element
      this.portalHost = new DomPortalHost(
        this.element.nativeElement,
        this.componentFactoryResolver,
        this.appRef,
        this.injector
      );

      // Attach handle to the column head
      this.buttonInstance = this.portalHost.attach(this.portal).instance;
      const instance: IsLockableButton = this.buttonInstance;
      instance.iconLocked = this.iconLocked;
      instance.iconUnlocked = this.iconUnlocked;
      instance.locked = this.locked;
      instance.onLock
        .pipe(takeUntil(this.destroy$))
        .subscribe(( locked ) => {
          this.handleLock(locked);
        });

      // if locked value was provided upon creation
      // set this element locked
      if (this.locked) {
        this.handleLock(this.locked);
      }
    });
  }
}
