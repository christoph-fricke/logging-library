// Simple integration tests of all core functionality. Might be extended in the future with an better integration infrastructure.
import {
  Logger,
  ConsoleHandler,
  LogLevel,
  LoggerStore,
  TestHandler,
  BaseHandler,
  ILogRecord,
} from "./";

test("Core logging functionality works as expected", () => {
  const mockInfo = jest.spyOn(global.console, "info").mockImplementation();
  const mockWarn = jest.spyOn(global.console, "warn").mockImplementation();
  const mockDebug = jest.spyOn(global.console, "debug").mockImplementation();

  const logger = new Logger().addHandler(new ConsoleHandler(LogLevel.INFO));

  logger.info("Some log using the default context.");

  const scoped = logger.withContext("Authentication");

  scoped.warning("This log is using the 'Authentication' context");

  scoped.debug("Some debug information");

  expect(mockInfo).toHaveBeenCalledWith(
    `INFO: [Default] - Some log using the default context.`
  );
  expect(mockWarn).toHaveBeenCalledWith(
    `WARNING: [Authentication] - This log is using the 'Authentication' context`
  );
  expect(mockDebug).not.toHaveBeenCalled();

  mockInfo.mockRestore();
  mockWarn.mockRestore();
  mockDebug.mockRestore();
});

test("Core store functionality works as expected", () => {
  const logger = new Logger().addHandler(new TestHandler());
  LoggerStore.add("first", logger);

  expect(LoggerStore.get("first")).toBe(logger);

  const logger2 = new Logger().addHandler(new TestHandler());
  LoggerStore.add("first", logger2);

  expect(LoggerStore.get("first")).toBe(logger2);

  expect(LoggerStore.remove("first")).toBeTruthy();
  expect(LoggerStore.get("first")).toBeUndefined();
});

test("Core custom handler functionality works as expected", () => {
  class CustomHandler extends BaseHandler {
    static records: ILogRecord[] = [];
    log(record: ILogRecord) {
      CustomHandler.records.push(record);
    }
  }
  const logger = new Logger().addHandler(new CustomHandler(LogLevel.TRACE));

  logger.info("test message");

  expect(CustomHandler.records).toHaveLength(1);
});
