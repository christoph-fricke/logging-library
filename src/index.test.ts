// Simple integration tests of all core functionality. Might be extended in the future with an better integration infrastructure.
import {
  Logger,
  ConsoleHandler,
  LogLevel,
  BaseHandler,
  getLogger,
  setLoggerAssignment,
} from "./";
import { LogRecord } from "./log-record";

test("A logger can be set and later required", () => {
  const mockInfo = jest.spyOn(global.console, "info").mockImplementation();
  const logger = new Logger().addHandler(new ConsoleHandler(LogLevel.INFO));

  setLoggerAssignment((id) => logger.withContext(id?.toString() ?? "default"));

  const assigned = getLogger("test");
  assigned.info("Test message");

  expect(mockInfo).toHaveBeenCalledWith(`INFO: [test] - Test message`);
});

test("Core logging functionality works as expected", () => {
  const mockInfo = jest.spyOn(global.console, "info").mockImplementation();
  const mockWarn = jest.spyOn(global.console, "warn").mockImplementation();
  const mockDebug = jest.spyOn(global.console, "debug").mockImplementation();

  const logger = new Logger().addHandler(new ConsoleHandler(LogLevel.INFO));

  logger.info("Some log using the default context.");

  const scoped = logger.withContext("Authentication");

  scoped.warn("This log is using the 'Authentication' context");

  scoped.debug("Some debug information");

  expect(mockInfo).toHaveBeenCalledWith(
    `INFO: [Default] - Some log using the default context.`
  );
  expect(mockWarn).toHaveBeenCalledWith(
    `WARN: [Authentication] - This log is using the 'Authentication' context`
  );
  expect(mockDebug).not.toHaveBeenCalled();

  mockInfo.mockRestore();
  mockWarn.mockRestore();
  mockDebug.mockRestore();
});

test("Core custom handler functionality works as expected", () => {
  class CustomHandler extends BaseHandler {
    static records: LogRecord[] = [];
    protected log(record: LogRecord): void {
      CustomHandler.records.push(record);
    }
  }
  const logger = new Logger().addHandler(new CustomHandler(LogLevel.DEBUG));

  logger.info("test message");

  expect(CustomHandler.records).toHaveLength(1);
});
