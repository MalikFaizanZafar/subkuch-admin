import { Subscription } from 'rxjs';

import { OnDestroy, OnInit } from '@angular/core';

import { IsResizeService } from '../service/resize.service';

/**
 * Abstract class that defines a resizable component.
 */
export abstract class IsResizeable implements OnInit, OnDestroy {

  /**
   * Event handler that is bound to onWindowResize native event.
   */
  protected resizeSubscriber: Subscription;

  /**
   * Constructor for IsResizeable
   * @param resizeService instance of IsResizeService
   */
  constructor( protected resizeService: IsResizeService ) {}

  /**
   * Life cycle event called on view init
   * Subscribes to window resize from resize service
   */
  ngOnInit(): void {
    this.resizeSubscriber = this
      .resizeService
      .onWindowResize
      .subscribe(this.onResize.bind(this));
  }

  /**
   * Life cycle event called on view destroy
   * Unsubscribe subscriptions
   */
  ngOnDestroy(): void {
    if (this.resizeSubscriber) {
      this.resizeSubscriber.unsubscribe();
    }
  }

  /**
   * Abstract function that needs to be implemented by its descendants
   * in order to properly resize upon window resizing.
   */
  abstract onResize(): void;
}
