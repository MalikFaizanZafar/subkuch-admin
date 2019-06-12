import { IsDatepickerStringToDateFormatter } from './datepicker.models';
import { isValid } from 'date-fns';

export const MONTHS = ['January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'];

export const WEEKDAYS = ['S', 'M', 'T', 'W', 'TH', 'F', 'S'];

export const DF_DEFAULT_STRING_TO_DATE_FORMATTER: IsDatepickerStringToDateFormatter = (text: string) => {
  const parsed = new Date(text);
  if (!isValid(parsed)) {
    return null;
  }
  return parsed;
};

