import { ILogRecord } from "./log-record";
import { LogLevel } from "./log-level";

export interface ILogHandler {
  readonly level: LogLevel;
  handle(record: ILogRecord): void;
}

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
