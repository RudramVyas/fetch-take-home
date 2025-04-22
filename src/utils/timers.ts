// src/utils/timers.ts

/**
 * Total session duration (in milliseconds): 1 hour
 */
export const SESSION_DURATION = 60 * 60 * 1000; // 3_600_000 ms

/**
 * Lead time before expiration to warn the user: 10 minutes
 */
export const WARNING_BEFORE = 10 * 60 * 1000;   // 600_000 ms

/**
 * Computes the delay (in ms) until the warning should fire,
 * based on the login timestamp.
 * Returns a positive number if warning is in the future,
 * or 0/negative if warning time has passed.
 */
export function getWarningDelay(loginTimestamp: number): number {
  const warnAt = loginTimestamp + SESSION_DURATION - WARNING_BEFORE;
  return warnAt - Date.now();
}

/**
 * Computes the delay (in ms) until the session expires,
 * based on the login timestamp.
 * Returns a positive number if expiration is in the future,
 * or 0/negative if session already expired.
 */
export function getLogoutDelay(loginTimestamp: number): number {
  const expireAt = loginTimestamp + SESSION_DURATION;
  return expireAt - Date.now();
}

/**
 * Helper to schedule both warning and logout timers.
 * Returns the timer IDs so you can clear them later.
 */
export function scheduleSessionTimers(
  loginTimestamp: number,
  onWarn: () => void,
  onExpire: () => void
): { warnTimerId?: number; logoutTimerId?: number } {
  const warnDelay = getWarningDelay(loginTimestamp);
  const logoutDelay = getLogoutDelay(loginTimestamp);

  const timers: { warnTimerId?: number; logoutTimerId?: number } = {};

  if (warnDelay > 0) {
    timers.warnTimerId = window.setTimeout(onWarn, warnDelay);
  }
  if (logoutDelay > 0) {
    timers.logoutTimerId = window.setTimeout(onExpire, logoutDelay);
  }

  return timers;
}

/**
 * Clears timers scheduled by `scheduleSessionTimers`.
 */
export function clearSessionTimers(
  timers: { warnTimerId?: number; logoutTimerId?: number }
): void {
  if (timers.warnTimerId != null) {
    clearTimeout(timers.warnTimerId);
  }
  if (timers.logoutTimerId != null) {
    clearTimeout(timers.logoutTimerId);
  }
}
