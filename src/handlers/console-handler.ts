import { BaseHandler } from "../handler";
import { ILogRecord } from "../log-record";
import { LogLevel } from "../log-level";

export class ConsoleHandler extends BaseHandler {
  private static active: boolean = true;

  static toggle(state?: boolean) {
    ConsoleHandler.active = state ?? !ConsoleHandler.active;
  }

  log(record: ILogRecord) {
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
      case LogLevel.FATAL:
        console.error(this.format(record));
        break;
    }
  }

  private format(record: ILogRecord): string {
    const timestring = record.date.toISOString();

    return `${timestring}\t[${record.context}]\t${record.msg}`;
  }
}

declare global {
  function toggleLogging(state?: boolean): void;
}

globalThis.toggleLogging = ConsoleHandler.toggle;
