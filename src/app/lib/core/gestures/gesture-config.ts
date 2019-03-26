import { Injectable, Inject, Optional } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
import {
  HammerStatic,
  HammerInstance,
  Recognizer,
  RecognizerStatic,
  HammerOptions
} from './gesture-annotations';
import { DF_HAMMER_OPTIONS } from './gesture-config-token';

/**
 * Adjusts configuration of our gesture library, Hammer.
 */
@Injectable()
export class IsGestureConfig extends HammerGestureConfig {
  private _hammer: HammerStatic = typeof window !== 'undefined' ? (window as any).Hammer : null;

  /**
   * List of new event names to add to the gesture support list
   */
  events: string[] = this._hammer ? [
    'slide',
    'slidestart',
    'slidemove',
    'slideend',
    'slideright',
    'slideleft'
  ] : [];

  constructor( @Optional() @Inject(DF_HAMMER_OPTIONS) private _hammerOptions?: HammerOptions ) {
    super();
  }

  /**
   * Builds Hammer instance manually to add custom recognizers that match the Material Design spec.
   *
   * More information on default recognizers can be found in Hammer docs:
   * http://hammerjs.github.io/recognizer-pan/
   * http://hammerjs.github.io/recognizer-press/
   *
   * @param element
   */
  buildHammer( element: HTMLElement ): HammerInstance {
    const mc = new this._hammer(element, this._hammerOptions || undefined);

    // Default Hammer Recognizers.
    const pan = new this._hammer.Pan();
    const swipe = new this._hammer.Swipe();
    const press = new this._hammer.Press();
    const slide = this._createRecognizer(pan, {event: 'slide', threshold: 0}, swipe);
    pan.recognizeWith(swipe);

    // Add customized gestures to Hammer manager
    mc.add([swipe, press, pan, slide]);

    return mc as HammerInstance;
  }

  /**
   * Creates a new recognizer, without affecting the default recognizers of HammerJS
   * @param base
   * @param options
   * @param inheritances
   */
  private _createRecognizer(base: Recognizer, options: any, ...inheritances: Recognizer[]) {
    const recognizer = new (base.constructor as RecognizerStatic)(options);

    inheritances.push(base);
    inheritances.forEach(item => recognizer.recognizeWith(item));

    return recognizer;
  }

}
