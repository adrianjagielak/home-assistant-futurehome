type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

function getTimestamp(): string {
  return new Date().toISOString();
}

let shouldShowDebugLog = false;

function _log(level: LogLevel, ...args: unknown[]): void {
  const timestamp = getTimestamp();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  switch (level) {
    case 'debug':
      if (shouldShowDebugLog) {
        console.debug(prefix, ...args);
      }
      break;
    case 'info':
      console.info(prefix, ...args);
      break;
    case 'warn':
      console.warn(prefix, ...args);
      break;
    case 'error':
    case 'fatal':
      console.error(prefix, ...args);
      break;
  }
}

export const log = {
  debug: (...args: unknown[]) => _log('debug', ...args),
  info: (...args: unknown[]) => _log('info', ...args),
  warn: (...args: unknown[]) => _log('warn', ...args),
  error: (...args: unknown[]) => _log('error', ...args),
  fatal: (...args: unknown[]) => _log('fatal', ...args),
};

export function setupLogger({ showDebugLog }: { showDebugLog: boolean }): void {
  shouldShowDebugLog = showDebugLog;
}
