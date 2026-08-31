/** biome-ignore-all lint/suspicious/noConsole: Allow console logging in development */

const getTimestamp = () => {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const formatScope = (scopes: readonly string[]) => scopes.map((scope) => `[${scope}]`).join(" ");

export class Logger {
  private readonly scopes: readonly string[];

  constructor(...scopes: string[]) {
    this.scopes = scopes;
  }

  private prefix(emoji?: string) {
    const parts = [`[${getTimestamp()}]`, formatScope(this.scopes)];
    if (emoji) {
      parts.push(emoji);
    }
    return parts.join(" ");
  }

  info = (...args: unknown[]) => console.info(this.prefix(), ...args);

  error = (...args: unknown[]) => console.error(this.prefix("❌"), ...args);

  warn = (...args: unknown[]) => console.warn(this.prefix("⚠️"), ...args);

  debug = (...args: unknown[]) => console.debug(this.prefix(), ...args);

  log = (...args: unknown[]) => console.log(this.prefix(), ...args);

  success = (...args: unknown[]) => console.log(this.prefix("✅"), ...args);
}

export const createLogger = (...scopes: string[]) => new Logger(...scopes);
