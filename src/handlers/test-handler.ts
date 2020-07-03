import { BaseHandler } from "../handler";
import { ILogRecord } from "../log-record";
import { LogLevel } from "../log-level";

/**
 * Logging handler that is intended to be used in tests. During testing logs should
 * not flood the console.
 */
export class TestHandler extends BaseHandler {
  public readonly records: ILogRecord[] = [];

  /**
   * @param level Defaults to `TRACE`.
   */
  constructor(level: LogLevel = LogLevel.TRACE) {
    super(level);
  }

  log(record: ILogRecord) {
    this.records.push(record);
  }
}
