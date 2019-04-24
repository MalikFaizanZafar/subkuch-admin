import { Pipe, PipeTransform } from '@angular/core';
/**
 * Format a file size
 * @example {{ 1024 | isFileSize }} formats to: 1kB
 * @export
 */
@Pipe({ name: 'IsFileSize' })
export class IsFileSizePipe implements PipeTransform {
  /**
   * This method transform the bytes number to a string with the equivalent number and size suffix.
   * @param valueBytes
   * @returns
   * @memberof IsFileSizePipe
   */
  transform(valueBytes: number): string {
    if (valueBytes === 0) {
      return '0 Bytes';
    }
    const base: number = 1000;
    const fixedRatio: number = 2;
    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const calc: number = Math.floor(Math.log(valueBytes) / Math.log(base));
    return (
      `${parseFloat((valueBytes / Math.pow(base, calc)).toFixed(fixedRatio))} ${sizes[calc]}`
    );
  }
}
