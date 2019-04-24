/* tslint:disable:no-misused-new */

/**
 * Stripped-down HammerJS annotations to use only necessary properties.
 */
export interface HammerInput {
  /**
   * Function to be called when preventDefault is called.
   */
  preventDefault: () => {};

  /**
   * Movement of X Axis
   */
  deltaX: number;

  /**
   * Movement of Y Axis
   */
  deltaY: number;

  /**
   * Center position for multi-touch, or just the single pointer.
   */
  center: { x: number; y: number; };
}

/**
 * Stripped-down HammerJS annotations to use only necessary properties.
 */
export interface HammerStatic {
  /**
   * Create a  new Hammer Manager instance
   */
  new( element: HTMLElement | SVGElement, options?: any ): HammerManager;

  /**
   * Pan Recognizer
   */
  Pan: Recognizer;

  /**
   * Swipe Recognizer
   */
  Swipe: Recognizer;

  /**
   * Press Recogizer
   */
  Press: Recognizer;
}

/**
 * Stripped-down HammerJS annotations to use only necessary properties.
 */
export interface Recognizer {
  /**
   * Creates new instance of Recognizer
   */
  new( options?: any ): Recognizer;

  /**
   * Method to recognize two gestures simultaneously
   */
  recognizeWith( otherRecognizer: Recognizer | string ): Recognizer;
}

/**
 * Stripped-down HammerJS annotations to use only necessary properties.
 */
export interface RecognizerStatic {
  /**
   * Creates new instance of Recognizer
   */
  new( options?: any ): Recognizer;
}

/**
 * Stripped-down HammerJS annotations to use only necessary properties.
 */
export interface HammerInstance {
  /**
   * Listen to events triggered
   */
  on( eventName: string, callback: () => void ): void;

  /**
   * Remove the bound events
   */
  off( eventName: string, callback: () => {} ): void;
}

/**
 * Stripped-down HammerJS annotations to use only necessary properties.
 */
export interface HammerManager {
  /**
   * Add a new recognizer instance to Manager
   */
  add( recogniser: Recognizer | Recognizer[] ): Recognizer;

  /**
   * Set Hammer options
   */
  set( options: any ): HammerManager;

  /**
   * Emit event
   */
  emit( event: string, data: any ): void;

  /**
   * Remove the bound events
   */
  off( events: string, handler?: () => {} ): void;

  /**
   * Listen to events triggered by the added recognizers
   */
  on( events: string, handler: () => {} ): void;
}

/**
 * HammerOptions definitions.
 */
export interface HammerOptions {
  /**
   * Css properties defined in a Key, value Dictionary.
   */
  cssProps?: { [key: string]: string };

  /**
   * Whether or not DOM events are delegated to Hammer
   */
  domEvents?: boolean;

  /**
   * Accepts a boolean, or a function that should return a boolean which is.
   */
  enable?: boolean | (( manager: HammerManager ) => boolean);

  /**
   * Default recognizer setup when calling Hammer().
   * When creating a new Manager these will be skipped.
   */
  preset?: any[];

  /**
   * Accepts the compute, auto, pan-y, pan-x and none values.
   * The default option will choose the correct value for you, based on the recognizers.
   */
  touchAction?: string;

  /**
   * List of recognizers
   */
  recognizers?: any[];

  /**
   * Force an input class
   */
  inputClass?: HammerInput;

  /**
   * Can be used to change the parent input target element
   */
  inputTarget?: EventTarget;
}
