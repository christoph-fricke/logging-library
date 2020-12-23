/**
 * Enum representing each log level.
 */
export enum LogLevel {
  DEBUG = 10,
  INFO = 20,
  WARN = 30,
  ERROR = 40,
}

/**
 * Get the name for a given LogLevel.
 * @param level LogLevel enum entry
 * @returns Name of the given level
 * @hidden
 */
export function getLogLevelName(level: LogLevel): keyof typeof LogLevel {
  switch (level) {
    case LogLevel.DEBUG:
      return "DEBUG";
    case LogLevel.INFO:
      return "INFO";
    case LogLevel.WARN:
      return "WARN";
    case LogLevel.ERROR:
      return "ERROR";
    default:
      throw new TypeError(
        "Unknown LogLevel provided. Please use the enum LogLevel for valid levels."
      );
  }
}
