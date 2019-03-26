export function isCurrentMonth(month: Date): boolean {
  if (!month) {
    return false;
  }

  const today: Date = new Date();
  return month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth();
}

export function isNextMonth(month: Date): boolean {
  if (!month) {
    return false;
  }

  const today: Date = new Date();

  return (
    (month.getFullYear() === today.getFullYear() && month.getMonth() - today.getMonth() === 1) ||
    (month.getFullYear() - today.getFullYear() === 1 && today.getMonth() - month.getMonth() === 11)
  );
}

export function isCurrentYear(date: Date): boolean {
  const today: Date = new Date();
  return date && today ? date.getFullYear() === today.getFullYear() : false;
}

export function getDateDiff(date1: Date, date2: Date, daysOnly: boolean = false): string {
  // Convert both dates to milliseconds
  const date1_ms: number = date1.getTime();
  const date2_ms: number = date2.getTime();
  // Calculate the difference in milliseconds
  let difference_ms: number = date2_ms - date1_ms;
  // take out milliseconds
  difference_ms = difference_ms / 1000;
  const seconds: number = Math.floor(difference_ms % 60);
  difference_ms = difference_ms / 60;
  const minutes: number = Math.floor(difference_ms % 60);
  difference_ms = difference_ms / 60;
  const hours: number = Math.floor(difference_ms % 24);
  const days: number = Math.floor(difference_ms / 24);

  if (daysOnly) {
    switch (days) {
      case 0:
        return 'Today';
      case 1:
        return '1 day ago';
      case 2:
        return '2 days ago';
      case 3:
        return '3 days ago';
      case 4:
        return '4 days ago';
      case 5:
        return '5 days ago';
      case 6:
        return '6 days ago';
      case 7:
        return '1 week ago';
      default:
        return '';
    }
  } else {
    return `${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`;
  }
}
