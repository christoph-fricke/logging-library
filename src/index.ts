// Meta API
export { getLogger, setLoggerAssignment, CoreLogger } from "./core";

export { LogLevel } from "./log-level";
export { BaseHandler, ILogHandler } from "./handler";
export { ILogger, Logger } from "./logger";
export { ILogRecord } from "./log-record";

export { ConsoleHandler } from "./handlers/console-handler";
export { TestHandler } from "./handlers/test-handler";
