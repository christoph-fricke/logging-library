import { BaseHandler } from "../handler";
import { ILogRecord } from "../log-record";
import { LogLevel } from "../log-level";

/**
 * Writes logs to the console with the native `console` object. Log format:
 * ISO-time-string [context] message
 */
export class ConsoleHandler extends BaseHandler {
  private static active: boolean = true;

  static toggle(active?: boolean) {
    ConsoleHandler.active = active ?? !ConsoleHandler.active;
  }

  protected log(record: ILogRecord) {
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

  private format(record: ILogRecord): string {
    const timestring = record.date.toISOString();

    return `${timestring}\t[${record.context}]\t${record.msg}`;
  }
}
