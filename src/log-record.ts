import { LogLevel } from "./log-level";

export interface ILogRecord {
  readonly level: LogLevel;
  readonly context: string;
  readonly msg: string;
  readonly date: Date;
}

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
