import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

import * as utilities from '@app/shared/utilities/date';

export const dontFix: string = `Don't fix`;
export const locale: string = 'en-US';

@Pipe({ name: 'batchTitle' })
export class BatchTitlePipe implements PipeTransform {
  transform(month: Date | undefined): string {
    if (!month) {
      return dontFix;
    } else if (utilities.isCurrentYear(month)) {
      return formatDate(month, 'MMM', locale);
    } else {
      return formatDate(month, 'MMM ´yy', locale);
    }
  }
}
