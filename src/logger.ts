import { LogLevel } from "./log-level";
import { ILogHandler } from "./handler";
import { LogRecord } from "./log-record";

export interface ILogger {
  trace(msg: string): void;
  debug(msg: string): void;
  info(msg: string): void;
  warning(msg: string): void;
  error(err: string | Error): void;
  fatal(err: string | Error): void;

  /**
   * Creates a new `logger` scoped to a given `context`. All current handlers are
   * copied over to the logger.
   * @param context New scope for the logger.
   */
  withContext(context: string): ILogger;
  addHandler(handler: ILogHandler): ILogger;

  /**
   * Current context this logger is scoped to.
   */
  readonly context: string;
}

export class Logger implements ILogger {
  private readonly _context: string;
  private handlers: ILogHandler[] = [];

  /**
   * Creates a new logger with no handlers configured. Add handlers with `addHandler`
   * using a Fluent API.
   * @param context Context for the new logger. Defaults to `Default`.
   */
  constructor(context?: string) {
    this._context = context ?? "Default";
  }

  withContext(context: string): ILogger {
    return new Logger(context).addHandlers(this.handlers);
  }

  private addHandlers(handlers: ILogHandler[]): ILogger {
    for (const handler of handlers) {
      this.handlers.push(handler);
    }

    return this;
  }

  addHandler(handler: ILogHandler): ILogger {
    this.handlers.push(handler);
    return this;
  }

  get context() {
    return this._context;
  }

  private notifyHandlers(level: LogLevel, message: string) {
    for (const handler of this.handlers) {
      handler.handle(new LogRecord(level, this._context, message));
    }
  }

  trace(msg: string) {
    this.notifyHandlers(LogLevel.TRACE, msg);
  }

  debug(msg: string) {
    this.notifyHandlers(LogLevel.DEBUG, msg);
  }

  info(msg: string) {
    this.notifyHandlers(LogLevel.INFO, msg);
  }

  warning(msg: string) {
    this.notifyHandlers(LogLevel.WARNING, msg);
  }

  error(err: string | Error) {
    const message = typeof err === "string" ? err : err.message;

    this.notifyHandlers(LogLevel.ERROR, message);
  }

  fatal(err: string | Error) {
    const message = typeof err === "string" ? err : err.message;

    this.notifyHandlers(LogLevel.FATAL, message);
  }
}
