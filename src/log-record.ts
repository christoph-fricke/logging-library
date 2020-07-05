import { LogLevel, getLogLevelName } from "./log-level";

/**
 * Represents a log record.
 */
export interface ILogRecord {
  /** Level used to create this record. */
  readonly level: LogLevel;
  /** String representation of the level. */
  readonly levelName: keyof typeof LogLevel;
  /** Context used for this record. */
  readonly context: string;
  /** Stored message. */
  readonly message: string;
  /** Timestamp at which the log record was created. */
  readonly date: Date;
}

/**
 * Implements `ILogRecord`. Should be used to construct new records.
 * @hidden
 */
export class LogRecord implements ILogRecord {
  readonly level: LogLevel;
  readonly levelName: keyof typeof LogLevel;
  readonly context: string;
  readonly message: string;
  readonly date: Date;

  constructor(level: LogLevel, context: string, msg: string) {
    this.level = level;
    this.levelName = getLogLevelName(level);
    this.context = context;
    this.message = msg;
    this.date = new Date();
  }
}
