import { LogLevel } from "./log-level";
import { ILogHandler } from "./handler";
import { LogRecord } from "./log-record";

export interface ILogger {
  /** Sends a log record with the level VERBOSE to all handlers.*/
  verbose(msg: string): void;

  /** Sends a log record with the level DEBUG to all handlers.*/
  debug(msg: string): void;

  /** Sends a log record with the level INFO to all handlers.*/
  info(msg: string): void;

  /** Sends a log record with the level WARNING to all handlers.*/
  warning(msg: string): void;

  /** Sends a log record with the level ERROR to all handlers.*/
  error(err: string | Error): void;

  /** Sends a log record with the level CRITICAL to all handlers.*/
  critical(err: string | Error): void;

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
    handler: ILogHandler,
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
  private handlers: ILogHandler[] = [];

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

  private addHandlers(handlers: ILogHandler[]): ILogger {
    for (const handler of handlers) {
      this.handlers.push(handler);
    }

    return this;
  }

  addHandler(
    handler: ILogHandler,
    condition?: boolean | (() => boolean)
  ): ILogger {
    if (typeof condition === "boolean" && !condition) return this;
    if (typeof condition === "function" && !condition()) return this;

    this.handlers.push(handler);
    return this;
  }

  private notifyHandlers(level: LogLevel, message: string) {
    for (const handler of this.handlers) {
      handler.handle(
        new LogRecord(message, {
          level,
          context: this._context,
          metadata: this._metadata,
        })
      );
    }
  }

  verbose(msg: string): void {
    this.notifyHandlers(LogLevel.VERBOSE, msg);
  }

  debug(msg: string): void {
    this.notifyHandlers(LogLevel.DEBUG, msg);
  }

  info(msg: string): void {
    this.notifyHandlers(LogLevel.INFO, msg);
  }

  warning(msg: string): void {
    this.notifyHandlers(LogLevel.WARNING, msg);
  }

  error(err: string | Error): void {
    const message = typeof err === "string" ? err : err.message;

    this.notifyHandlers(LogLevel.ERROR, message);
  }

  critical(err: string | Error): void {
    const message = typeof err === "string" ? err : err.message;

    this.notifyHandlers(LogLevel.CRITICAL, message);
  }
}
