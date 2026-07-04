/**
 * Time utilities for milliseconds
 */
const A_SECOND = 1000;
const A_MINUTE = 60 * 1000;
const A_HOUR = 60 * 60 * 1000;
const A_DAY = 24 * 60 * 60 * 1000;

export const ms = {
  Min: (m: number) => m * A_MINUTE,
  Sec: (s: number) => s * A_SECOND,
  Hour: (h: number) => h * A_HOUR,
  Day: (d: number) => d * A_DAY,
};
