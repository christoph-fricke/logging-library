import { LogLevel } from "./log-level";

/**
 * Represents a log record.
 */
export interface ILogRecord {
  /** Level used to create this record. */
  readonly level: LogLevel;
  /** Context used for this record. */
  readonly context: string;
  /** Stored message. */
  readonly msg: string;
  /** Timestamp at which the log record was created. */
  readonly date: Date;
}

/**
 * Implements `ILogRecord`. Should be used to construct new records.
 */
export class LogRecord implements ILogRecord {
  readonly level: LogLevel;
  readonly context: string;
  readonly msg: string;
  readonly date: Date;

  constructor(level: LogLevel, context: string, msg: string) {
    this.level = level;
    this.context = context;
    this.msg = msg;
    this.date = new Date();
  }
}
