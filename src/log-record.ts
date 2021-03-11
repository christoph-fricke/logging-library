import { LogLevel, getLogLevelName } from "./log-level";

interface LogRecordConfig {
  level: LogLevel;
  context: string;
  metadata: Record<string, unknown>;
}

/**
 * A log record contains a information about a logging attempt. This information
 * is passed to all registered `LogHandler` by a `Logger` instance.
 */
export class LogRecord {
  /** Level used to create this record. */
  readonly level: LogLevel;
  /** String representation of the level. */
  readonly levelName: keyof typeof LogLevel;
  /** Context used for this record. */
  readonly context: string;
  /** Arguments that were passed to the logger. */
  readonly args: unknown[];
  /** Arguments formatted as a string. Multiple arguments are separated by a space. */
  readonly message: string;
  /** Timestamp at which the log record was created. */
  readonly date: Date;
  /** Extra meta data configured with a logger. */
  readonly metadata: Record<string, unknown>;

  constructor(args: unknown[], config: LogRecordConfig) {
    this.level = config.level;
    this.levelName = getLogLevelName(config.level);
    this.context = config.context;
    this.args = args;
    this.message = argsToString(args);
    this.date = new Date();
    this.metadata = config.metadata;
  }
}

/**@hidden */
function argsToString(args: unknown[]): string {
  return args.reduce(
    (prev: string, curr) =>
      prev === "" ? asString(curr) : `${prev} ${asString(curr)}`,
    ""
  );
}

/**@hidden */
function asString(data: unknown): string {
  if (typeof data === "string") {
    return data;
  }

  if (
    data === null ||
    typeof data === "number" ||
    typeof data === "bigint" ||
    typeof data === "boolean" ||
    typeof data === "symbol"
  ) {
    return String(data);
  }

  if (data instanceof Error) {
    return data.stack ?? data.message;
  }

  if (typeof data === "object") {
    return JSON.stringify(data);
  }

  if (typeof data === "function") {
    const funcName = data.name !== "" ? data.name : "(anonymous)";
    return `[Function ${funcName}]`;
  }

  return "undefined";
}
