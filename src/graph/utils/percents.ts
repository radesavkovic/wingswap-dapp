/**
 * gets the amoutn difference plus the % change in change itself (second order change)
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 * @param {*} value48HoursAgo
 */
export function get2DayPercentChange(
  valueNow: number | string,
  value24HoursAgo: number | string,
  value48HoursAgo: number | string,
) {
  // get volume info for both 24 hour periods
  const currentChange = parseFloat(valueNow as any) - parseFloat(value24HoursAgo as any);
  const previousChange = parseFloat(value24HoursAgo as any) - parseFloat(value48HoursAgo as any);

  const adjustedPercentChange = ((currentChange - previousChange) / previousChange) * 100;

  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return [currentChange, 0];
  }
  return [currentChange, adjustedPercentChange];
}

/**
 * get standard percent change between two values
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 */
export function getPercentChange(valueNow: number | string, value24HoursAgo: number | string) {
  const adjustedPercentChange =
    ((parseFloat(valueNow as any) - parseFloat(value24HoursAgo as any)) / parseFloat(value24HoursAgo as any)) * 100;
  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return 0;
  }
  return adjustedPercentChange;
}
