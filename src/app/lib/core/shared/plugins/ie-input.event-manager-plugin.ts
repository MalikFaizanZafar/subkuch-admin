import { Inject, Injectable, Provider, NgModule, ModuleWithProviders } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Platform, PlatformModule } from '@angular/cdk/platform';

/**
 * Event manager plugin to handle 'input' events in IE10/11 properly.
 *
 * This can extend EventManagerPlugin once it is made public
 */
@Injectable()
export class IsIEInputEventManagerPlugin {

  /**
   * Reference to browser's document
   * Declared here instead of constructor to avoid AOT problems
   */
  private document: Document;

  /**
   * @param document
   * @param platform
   */
  constructor(
    @Inject(DOCUMENT) document: any,
    private platform: Platform
  ) {
    this.document = document;
  }

  /**
   * Checks if this plugin supports the incoming event
   *
   * @param eventName The name of the event
   */
  supports(eventName: string): boolean {
    return this.platform.TRIDENT && eventName === 'input';
  }

  /**
   * The actual method called by the EventManager to add listeners to elements,
   * which adds the listeners and returns a function that removes the listener.
   *
   * @param element
   * @param eventName
   * @param originalHandler
   */
  addEventListener(
    element: Element,
    eventName: string,
    originalHandler: (event: Event) => void
  ): () => void {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      return this.handleIEAddEventListener(element, eventName, originalHandler);
    }
    return this.handleRegularAddEventListener(element, eventName, originalHandler);
  }

  /**
   * Handles events normally
   * @param element
   * @param eventName
   * @param originalHandler
   */
  private handleRegularAddEventListener(
    element: Element,
    eventName: string,
    originalHandler: (event: Event) => void
  ): () => void {
    element.addEventListener(eventName, originalHandler, false);
    return () => element.removeEventListener(eventName, originalHandler, false);
  }

  /**
   * Special handling for input events in IE10/11 for native input elements
   * @param element
   * @param eventName
   * @param originalHandler
   */
  private handleIEAddEventListener(
    element: HTMLInputElement | HTMLTextAreaElement,
    eventName: string,
    originalHandler: (event: Event) => void
  ): () => void {
    // element is a native input, so we need to handle it differently to fix IE's erroneous
    // behavior of dispatching 'input' events when value hasn't changed, like when setting a
    // placeholder on the input.

    // lets store the initial value of the element
    let value: string = element.value;

    const inputHandler = (event: Event) => {
      // Makes sure the value has changed before dispatching a new input event
      if (element.value !== value) {
        value = element.value;
        originalHandler(event);
      }
    };
    element.addEventListener(eventName, inputHandler, false);
    return () => {
      element.removeEventListener(eventName, inputHandler, false);
    };
  }

  /**
   * Method called by the EventManager when binding listeners via a selector.
   * @param selector
   * @param eventName
   * @param handler
   */
  addGlobalEventListener(
    selector: string,
    eventName: string,
    handler: (event: Event) => void
  ): () => void {
    const element = this.document.querySelector(selector);
    return this.addEventListener(element, eventName, handler);
  }
}

export const DF_IE_INPUT_EVENT_MANAGER_PLUGIN_PROVIDER: Provider = {
  provide: EVENT_MANAGER_PLUGINS,
  useClass: IsIEInputEventManagerPlugin,
  deps: [DOCUMENT, Platform],
  multi: true
};

@NgModule({
  imports: [PlatformModule],
  providers: [DF_IE_INPUT_EVENT_MANAGER_PLUGIN_PROVIDER]
})
export class IsIEInputEventManagerPluginModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IsIEInputEventManagerPluginModule
    };
  }
}
