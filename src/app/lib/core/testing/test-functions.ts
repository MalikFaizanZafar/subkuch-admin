import * as d3 from 'd3';

/**
 * To be used to create the mocked
 * touch event for unit testing.
 * @param type
 * @param x
 * @param y
 * @param node
 */
export function touchEventOn(
  type: string,
  x?: number,
  y?: number,
  node?: HTMLElement): void {
  let touchEvent: any;
  let xVal: number = x;
  let yVal: number = x;
  if (xVal === null) {
    xVal = 0;
  }
  if (yVal === null) {
    yVal = 0;
  }
  try {
    touchEvent = document.createEvent('TouchEvent');
    touchEvent.initTouchEvent(type, true, true);
  } catch (_error) {
    try {
      touchEvent = document.createEvent('UIEvent');
      touchEvent.initUIEvent(type, true, true);
    } catch (_error) {
      touchEvent = document.createEvent('Event');
      touchEvent.initEvent(type, true, true);
    }
  }
  touchEvent.changedTouches = [
    {
      pageX: x,
      pageY: y,
      clientX: x,
      clientY: y,
      target: node
    }
  ];
  return touchEvent;
}

/**
 * Force d3 to invoke all the transition.('end') immediately
 * so that the async calls within a test case can resolve
 */
export function flushAllD3Transitions(): void {
  const now: () => number = performance.now;
  performance.now = (): number => Infinity;
  // d3.timerFlush();
  performance.now = now;
}
