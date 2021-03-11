import { LogLevel } from "./log-level";
import { LogHandler } from "./handler";
import { LogRecord } from "./log-record";

export interface ILogger {
  /** Sends a log record with the level DEBUG to all handlers.*/
  debug(...args: unknown[]): void;

  /** Sends a log record with the level INFO to all handlers.*/
  info(...args: unknown[]): void;

  /** Sends a log record with the level WARNING to all handlers.*/
  warn(...args: unknown[]): void;

  /** Sends a log record with the level ERROR to all handlers.*/
  error(...args: unknown[]): void;

  /**
   * Creates a new `logger` scoped to a given `context`. All current handlers and metadata
   * is copied over to the logger.
   * @param context New scope for the logger.
   */
  withContext(context: string): ILogger;

  /**
   * Attaches an `ILogHandler` to this instance. All created `ILogRecord`s will
   * be passed to the given handler.
   * @param handler Handler that receives created `ILogRecords`
   * @param condition Optional condition for adding the `handler`.
   * Allows `handlers` to be added conditionally while using a fluent api.
   */
  addHandler(
    handler: LogHandler,
    condition?: boolean | (() => boolean)
  ): ILogger;

  /**
   * Adds a metadata object to the logger which will be included in created `ILogRecord`s.
   * New metadata will be merged with existing metadata. Existing keys will be overwritten.
   * @param metadata Metadata to add to the logger
   */
  addMetadata(metadata: Record<string, unknown>): ILogger;

  /**
   * Current context this logger is scoped to.
   */
  readonly context: string;

  /**
   * Current metadata stored on this logger.
   */
  readonly metadata: Record<string, unknown>;
}

export class Logger implements ILogger {
  private readonly _context: string;
  private _metadata: Record<string, unknown> = {};
  private handlers: LogHandler[] = [];

  /**
   * Creates a new logger with no handlers configured. Add handlers with `addHandler`
   * using a Fluent API.
   * @param context Context for the new logger. Defaults to `Default`.
   */
  constructor(context?: string) {
    this._context = context ?? "Default";
  }

  get context(): string {
    return this._context;
  }

  get metadata(): Record<string, unknown> {
    return this._metadata;
  }

  withContext(context: string): ILogger {
    return new Logger(context)
      .addHandlers(this.handlers)
      .addMetadata(this.metadata);
  }

  addMetadata(metadata: Record<string, unknown>): ILogger {
    this._metadata = { ...this._metadata, ...metadata };

    return this;
  }

  private addHandlers(handlers: LogHandler[]): ILogger {
    for (const handler of handlers) {
      this.handlers.push(handler);
    }

    return this;
  }

  addHandler(
    handler: LogHandler,
    condition?: boolean | (() => boolean)
  ): ILogger {
    if (typeof condition === "boolean" && !condition) return this;
    if (typeof condition === "function" && !condition()) return this;

    this.handlers.push(handler);
    return this;
  }

  private notifyHandlers(level: LogLevel, args: unknown[]) {
    const record = new LogRecord(args, {
      level,
      context: this._context,
      metadata: this._metadata,
    });
    for (const handler of this.handlers) {
      handler.handle(record);
    }
  }

  debug(...args: unknown[]): void {
    this.notifyHandlers(LogLevel.DEBUG, args);
  }

  info(...args: unknown[]): void {
    this.notifyHandlers(LogLevel.INFO, args);
  }

  warn(...args: unknown[]): void {
    this.notifyHandlers(LogLevel.WARN, args);
  }

  error(...args: unknown[]): void {
    this.notifyHandlers(LogLevel.ERROR, args);
  }
}
