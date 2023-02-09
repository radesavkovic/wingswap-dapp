import 'dayjs/plugin/utc';

import dayjs from 'dayjs';

import { TimeframeOptions } from '../constants';

export function getTimeframe(timeWindow: TimeframeOptions) {
  const utcEndTime = dayjs.utc();
  // based on window, get starttime
  let utcStartTime;
  switch (timeWindow) {
    case TimeframeOptions.WEEK:
      utcStartTime = utcEndTime.subtract(1, 'week').endOf('day').unix() - 1;
      break;
    case TimeframeOptions.MONTH:
      utcStartTime = utcEndTime.subtract(1, 'month').endOf('day').unix() - 1;
      break;
    case TimeframeOptions.ALL_TIME:
      utcStartTime = utcEndTime.subtract(1, 'year').endOf('day').unix() - 1;
      break;
    default:
      utcStartTime = utcEndTime.subtract(1, 'year').startOf('year').unix() - 1;
      break;
  }
  return utcStartTime;
}
