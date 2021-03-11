import { BaseHandler } from "../handler";
import { LogRecord } from "../log-record";
import { LogLevel } from "../log-level";

/**
 * Logging handler that is intended to be used in tests. During testing logs should
 * not flood the console.
 */
export class TestHandler extends BaseHandler {
  private _records: LogRecord[];

  /**
   * @param level Defaults to `DEBUG`.
   */
  constructor(level: LogLevel | LogLevel[] = LogLevel.DEBUG) {
    super(level);

    this._records = [];
  }

  /** Queue with all log records handled by this handler. */
  get records(): ReadonlyArray<LogRecord> {
    return this._records;
  }

  protected log(record: LogRecord): void {
    this._records.push(record);
  }

  /** Removes all stored records from this handler. */
  public clear(): void {
    this._records = [];
  }
}
