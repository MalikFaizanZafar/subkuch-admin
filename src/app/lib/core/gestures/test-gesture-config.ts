import { Injectable } from '@angular/core';
import { IsGestureConfig } from './gesture-config';
import { HammerManager } from './gesture-annotations';

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
  buildHammer( element: HTMLElement ) {
    const mc = super.buildHammer(element) as HammerManager;
    const instance = this.hammerInstances.get(element);

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
  emitEventForElement( eventType: string, element: HTMLElement, eventData = {} ) {
    const instances = this.hammerInstances.get(element);

    if (instances) {
      instances.forEach(instance => instance.emit(eventType, eventData));
    }
  }
}
