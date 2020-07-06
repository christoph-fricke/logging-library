import { BaseHandler } from "../handler";
import { ILogRecord } from "../log-record";
import { LogLevel } from "../log-level";

/**
 * Logging handler that is intended to be used in tests. During testing logs should
 * not flood the console.
 */
export class TestHandler extends BaseHandler {
  /** Queue with all log records handled by this handler. */
  public readonly records: ILogRecord[] = [];

  /**
   * @param level Defaults to `TRACE`.
   */
  constructor(level: LogLevel | LogLevel[] = LogLevel.TRACE) {
    super(level);
  }

  protected log(record: ILogRecord): void {
    this.records.push(record);
  }
}
