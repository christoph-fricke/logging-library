import { ILogRecord } from "./log-record";
import { LogLevel } from "./log-level";

/**
 * Interface used for log handlers. Every handler has to implement this interface.
 * Alternatively custom handlers can extend the abstract class `BaseHandler`.
 */
export interface ILogHandler {
  readonly level: LogLevel;
  handle(record: ILogRecord): void;
}

/**
 * BaseHandler that takes care of filtering log records that does not meet the
 * required level.
 * Custom handler can extend this class and override the log method with their
 * implementation.
 */
export abstract class BaseHandler implements ILogHandler {
  readonly level: LogLevel;

  constructor(level: LogLevel) {
    this.level = level;
  }

  handle(record: ILogRecord) {
    if (this.level > record.level) return;

    this.log(record);
  }

  protected abstract log(record: ILogRecord): void;
}
