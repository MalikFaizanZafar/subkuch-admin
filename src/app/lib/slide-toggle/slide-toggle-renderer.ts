  import { Platform } from '@angular/cdk/platform';
  import { ElementRef } from '@angular/core';

  /**
   * Renderer for the Slide Toggle component, which separates DOM modification in its own class
   */
  export class IsSlideToggleRenderer {

    /**
     * Reference to the thumb HTMLElement.
     */
    private thumbElement: HTMLElement;

    /**
     * Reference to the thumb bar HTMLElement.
     */
    private thumbBarElement: HTMLElement;

    /**
     * Width of the thumb bar of the slide-toggle.
     */
    private thumbBarWidth: number;

    /**
     * Previous checked state before drag started.
     */
    private _previousChecked: boolean;

    /**
     * Percentage of the thumb while dragging. Percentage as fraction of 100.
     */
    dragPercentage: number;

    /**
     * Whether the thumb is currently being dragged.
     */
    dragging = false;

    constructor( elementRef: ElementRef, platform: Platform ) {
      // We only need to interact with these elements when we're on the browser, so only grab
      // the reference in that case.
      if (platform.isBrowser) {
        this.thumbElement = elementRef.nativeElement.querySelector('.is-slide-toggle__thumb');
        this.thumbBarElement = elementRef.nativeElement.querySelector('.is-slide-toggle__bar');
      }
    }

    /**
     * Initializes the drag of the slide-toggle.
     * @param checked
     */
    startThumbDrag( checked: boolean ) {
      if (this.dragging) {
        return;
      }
      this.thumbBarWidth = (this.thumbBarElement.clientWidth - this.thumbElement.clientWidth) * (112 / 100);
      this.thumbElement.classList.add('is-dragging');

      this._previousChecked = checked;
      this.dragging = true;
    }

    /**
     * Resets the current drag and returns the new checked value.
     */
    stopThumbDrag(): boolean {
      if (!this.dragging) {
        return false;
      }

      this.dragging = false;
      this.thumbElement.classList.remove('is-dragging');

      // Reset the transform because the component will take care of the thumb position after drag.
      this.thumbElement.style.transform = '';
      return this.dragPercentage > 50;
    }

    /**
     * Updates the thumb containers position from the specified distance.
     * @param distance
     */
    updateThumbPosition( distance: number ) {
      this.dragPercentage = this._getDragPercentage(distance);
      const dragX = (this.dragPercentage / 100) * this.thumbBarWidth;
      this.thumbElement.style.transform = `translate3d(${dragX}px, 0, 0)`;
    }

    /**
     * Retrieves the percentage of thumb from the moved distance. Percentage as fraction of 100.
     */
    private _getDragPercentage( distance: number ) {
      let percentage = (distance / this.thumbBarWidth) * 100;
      if (this._previousChecked) {
        percentage += 100;
      }

      return Math.max(0, Math.min(percentage, 100));
    }

  }
