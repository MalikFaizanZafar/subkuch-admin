/**
 * Dimensions
 */
export class IsDimensions {
  /**
   * Width in number
   */
  width?: number | string;

  /**
   * Height
   */
  height?: number | string;

  /**
   * Creates an instance of IsDimensions.
   * @param [width] width of the element
   * @param [height] height of the element
   */
  constructor(width?: number | string, height?: number | string) {
    if (width) {
      this.width = this.formatCssUnit(width);
    }
    if (height) {
      this.height = this.formatCssUnit(height);
    }
  }

  /**
   * Format value to pixel if number
   * @param value
   */
  private formatCssUnit(value: number | string): string {
    const isNum: boolean = typeof value === 'string' ? /^\d+$/.test(value) : true;
    return isNum ? `${value}px` : value as string;
  }
}
