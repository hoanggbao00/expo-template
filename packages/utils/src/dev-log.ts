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
  info: (...args) => {
    return console.info(`[${getTimestamp()}]`, ...args);
  },
  error: (...args) => {
    return console.error(`[${getTimestamp()}] ❌`, ...args);
  },
  warn: (...args) => {
    return console.warn(`[${getTimestamp()}] ⚠️`, ...args);
  },
  debug: (...args) => {
    return console.debug(`[${getTimestamp()}]`, ...args);
  },
  log: (...args) => {
    return console.log(`[${getTimestamp()}]`, ...args);
  },
  success: (...args) => {
    return console.log(`[${getTimestamp()}] ✅`, ...args);
  },
};
