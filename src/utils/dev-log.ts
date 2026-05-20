/** biome-ignore-all lint/suspicious/noConsole: Allow console logging in development */
interface DevLog {
  info: typeof console.log;
  error: typeof console.error;
  warn: typeof console.warn;
  debug: typeof console.debug;
  log: typeof console.log;
  success: typeof console.log;
}

const getTimestamp = () => {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

export const devLog: DevLog = {
  info: (...args) => console.info(`[${getTimestamp()}]`, ...args),
  error: (...args) => console.error(`[${getTimestamp()}] ❌`, ...args),
  warn: (...args) => console.warn(`[${getTimestamp()}] ⚠️`, ...args),
  debug: (...args) => console.debug(`[${getTimestamp()}]`, ...args),
  log: (...args) => console.log(`[${getTimestamp()}]`, ...args),
  success: (...args) => console.log(`[${getTimestamp()}] ✅`, ...args),
};
