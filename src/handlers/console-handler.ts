import { BaseHandler } from "../handler";
import { ILogRecord } from "../log-record";
import { LogLevel } from "../log-level";

interface IConsoleHandlerOptions {
  format?: (record: ILogRecord) => string;
}

/**
 * Writes logs to the console with the native `console` object. Log format:
 * ISO-time-string [context] message
 */
export class ConsoleHandler extends BaseHandler {
  private static active = true;

  private readonly format: (record: ILogRecord) => string;

  constructor(level: LogLevel, options?: IConsoleHandlerOptions) {
    super(level);
    this.format = options?.format ?? this.defaultFormat;
  }

  static toggle(active?: boolean): void {
    ConsoleHandler.active = active ?? !ConsoleHandler.active;
  }

  protected log(record: ILogRecord): void {
    if (!ConsoleHandler.active) return;

    switch (record.level) {
      case LogLevel.TRACE:
        console.trace(this.format(record));
        break;
      case LogLevel.DEBUG:
        console.debug(this.format(record));
        break;
      case LogLevel.INFO:
        console.info(this.format(record));
        break;
      case LogLevel.WARNING:
        console.warn(this.format(record));
        break;
      case LogLevel.ERROR:
        console.error(this.format(record));
        break;
      case LogLevel.CRITICAL:
        console.error(this.format(record));
        break;
    }
  }

  private defaultFormat(record: ILogRecord): string {
    const timestring = record.date.toISOString();

    return `${timestring}\t[${record.context}]\t${record.msg}`;
  }
}
