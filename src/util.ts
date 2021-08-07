import type { TimeElapsed } from "./types";

export function toDateTimeLocalString(date: Date): string {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, -5);
}

export function parseElapsed(timestamps: Date[]): TimeElapsed {
  // are there timestamps?
  if (timestamps.length < 2)
    return {
      timestamp: "",
      aria: "no time elapsed",
      elapsed: "00:00",
    };

  // are the timestamps in order?
  let previous = timestamps[0].getTime();
  const timestampsOrdered = timestamps.every((timestamp) => {
    const current = timestamp.getTime();
    if (current < previous) return false;
    previous = current;
    return true;
  });
  if (!timestampsOrdered)
    return {
      timestamp: `timestamps disordered after ${new Date(
        previous
      ).toLocaleString()}`,
      aria: "timestamps disordered",
      elapsed: "00:00",
    };

  // derive elapsed time
  const first = timestamps[0];
  const last = timestamps[timestamps.length - 1];
  const msElapsed = timestamps.reduce((acc, timestamp, i) => {
    return i % 2 === 0 ? acc - timestamp.getTime() : acc + timestamp.getTime();
  }, 0);
  const secElapsed = Math.floor(msElapsed / 1000);

  const minutesElapsed = Math.floor(secElapsed / 60);
  const secondsElapsed = secElapsed % 60;

  const timestamp = `${first.toLocaleString()} to ${last.toLocaleTimeString()}`;
  const aria = `${minutesElapsed} minutes and ${secondsElapsed} seconds elapsed`;
  const elapsed = [minutesElapsed, secondsElapsed]
    .map((n) => `0${n}`.slice(-2))
    .join(":");

  return { timestamp, aria, elapsed };
}
