/** Defines the time window, in minutes, for displaying the load history data in the chart. */
export const LOAD_HISTORY_TIME_WINDOW_MINUTES = 10;
/** Defines the interval, in seconds, that the data should be fetched. */
export const FETCH_INTERVAL_SECONDS = 10;
/**
 * The threshold value for determining high average CPU load.
 * A CPU is considered under high load if its average load exceeds this value.
 */
export const HIGH_LOAD_THRESHOLD = 1;
/**
 * The duration, in minutes, used to evaluate load status:
 * - Load is considered high if it exceeds the threshold for this duration.
 * - Load is considered recovered if it remains below the threshold for this duration.
 */
export const LOAD_THRESHOLD_MINUTES = 2;
