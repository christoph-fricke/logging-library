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
  /** Extra meta data configured with a logger. */
  readonly metadata: Record<string, unknown>;
}

interface LogRecordConfig {
  level: LogLevel;
  context: string;
  metadata: Record<string, unknown>;
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
  readonly metadata: Record<string, unknown>;

  constructor(message: string, config: LogRecordConfig) {
    this.level = config.level;
    this.levelName = getLogLevelName(config.level);
    this.context = config.context;
    this.message = message;
    this.date = new Date();
    this.metadata = config.metadata;
  }
}
