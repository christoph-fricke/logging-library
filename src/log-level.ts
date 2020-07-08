/**
 * Enum representing each log level.
 */
export enum LogLevel {
  VERBOSE = 10,
  DEBUG = 20,
  INFO = 30,
  WARNING = 40,
  ERROR = 50,
  CRITICAL = 60,
}

/**
 * Get the name for a given LogLevel.
 * @param level LogLevel enum entry
 * @returns Name of the given level
 * @hidden
 */
export function getLogLevelName(level: LogLevel): keyof typeof LogLevel {
  switch (level) {
    case LogLevel.VERBOSE:
      return "VERBOSE";
    case LogLevel.DEBUG:
      return "DEBUG";
    case LogLevel.INFO:
      return "INFO";
    case LogLevel.WARNING:
      return "WARNING";
    case LogLevel.ERROR:
      return "ERROR";
    case LogLevel.CRITICAL:
      return "CRITICAL";
    default:
      throw new TypeError(
        "Unknown LogLevel provided. Please use the enum LogLevel for valid levels."
      );
  }
}
