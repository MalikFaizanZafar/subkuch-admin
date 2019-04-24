import { Injectable } from '@angular/core';

import { HammerInstance, HammerManager } from './gesture-annotations';
import { IsGestureConfig } from './gesture-config';

/**
 * An extension of GestureConfig that exposes the underlying HammerManager instances.
 * Tests can use these instances to emit fake gesture events.
 */
@Injectable()
export class TestGestureConfig extends IsGestureConfig {
  /**
   * A map of Hammer instances to element.
   * Used to emit events over instances for an element.
   */
  hammerInstances: Map<HTMLElement, HammerManager[]> = new Map<HTMLElement, HammerManager[]>();

  /**
   * Create a mapping of Hammer instances to element so that events can be emitted during testing.
   */
  buildHammer( element: HTMLElement ): HammerInstance {
    const mc: any = super.buildHammer(element);
    const instance: HammerManager[] = this.hammerInstances.get(element);

    if (instance) {
      instance.push(mc);
    } else {
      this.hammerInstances.set(element, [mc]);
    }

    return mc;
  }

  /**
   * The Angular event plugin for Hammer creates a new HammerManager instance for each listener,
   * so we need to apply our event on all instances to hit the correct listener.
   */
  emitEventForElement( eventType: string, element: HTMLElement, eventData: any = {} ): void {
    const instances: any[] = this.hammerInstances.get(element);

    if (instances) {
      instances.forEach((instance: any) => instance.emit(eventType, eventData));
    }
  }
}
