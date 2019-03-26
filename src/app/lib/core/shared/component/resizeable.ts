import { OnInit, OnDestroy } from '@angular/core';

import { IsResizeService } from '../service/resize.service';
import { Subscription } from 'rxjs/Subscription';

export abstract class IsResizeable implements OnInit, OnDestroy {

  protected resizeSubscriber: Subscription;

  constructor( protected resizeService: IsResizeService ) {}

  ngOnInit() {
    this.resizeSubscriber = this
      .resizeService
      .onWindowResize
      .subscribe(this.onResize.bind(this));
  }

  ngOnDestroy() {
    if (this.resizeSubscriber) {
      this.resizeSubscriber.unsubscribe();
    }
  }

  abstract onResize();

}
