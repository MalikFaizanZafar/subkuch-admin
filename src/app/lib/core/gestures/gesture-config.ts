import { Inject, Injectable, Optional } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
import {
  HammerInstance,
  HammerOptions,
  HammerStatic,
  Recognizer,
  RecognizerStatic
} from './gesture-annotations';
import { IS_HAMMER_OPTIONS } from './gesture-config-token';

/**
 * Adjusts configuration of our gesture library, Hammer.
 */
@Injectable({
  providedIn: 'root',
})
export class IsGestureConfig extends HammerGestureConfig {

  /**
   * Hammer object
   */
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
    'slideleft',
    'longpress'
  ] : [];

  /**
   * Constructor for IsGestureConfig
   * @param _hammerOptions Hammer options
   */
  constructor( @Optional() @Inject(IS_HAMMER_OPTIONS) private _hammerOptions?: HammerOptions ) {
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
    // touchAction: 'pan-y' is needed to enable normal scrolling via slide gesture
    const opts: any = {
      ...this._hammerOptions,
      touchAction: 'pan-y'
    };
    const mc: any = new this._hammer(element, opts || undefined);

    // Default Hammer Recognizers.
    const pan: Recognizer = new this._hammer.Pan();
    const swipe: Recognizer = new this._hammer.Swipe();
    const press: Recognizer = new this._hammer.Press();
    const slide: Recognizer = this._createRecognizer(pan, {event: 'slide', threshold: 0}, swipe);
    const longpress: Recognizer = this._createRecognizer(press, {event: 'longpress', time: 252});

    pan.recognizeWith(swipe);

    // Add customized gestures to Hammer manager
    mc.add([swipe, press, pan, slide, longpress]);

    return mc as HammerInstance;
  }

  /**
   * Creates a new recognizer, without affecting the default recognizers of HammerJS
   * @param base
   * @param options
   * @param inheritances
   */
  private _createRecognizer(base: Recognizer, options: any, ...inheritances: Recognizer[]): Recognizer {
    const recognizer: Recognizer = new (base.constructor as RecognizerStatic)(options);

    inheritances.push(base);
    inheritances.forEach((item: Recognizer) => recognizer.recognizeWith(item));

    return recognizer;
  }
}
