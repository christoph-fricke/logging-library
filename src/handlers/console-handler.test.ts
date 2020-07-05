import { ConsoleHandler } from "./console-handler";
import { LogLevel } from "../log-level";
import { buildLogRecord } from "../test-helper/log-record-builder";
import { ILogRecord } from "../log-record";

describe("ConsoleHandler", () => {
  it("should initialize its level to the given level", () => {
    const handler = new ConsoleHandler(LogLevel.ERROR);

    expect(handler.level).toBe(LogLevel.ERROR);
  });

  describe("format", () => {
    it("should be able to use a custom format", () => {
      const mock = jest.spyOn(global.console, "info").mockImplementation();
      const format = (record: ILogRecord) =>
        `${record.context} - ${record.message}`;

      const handler = new ConsoleHandler(LogLevel.INFO, { format });
      handler.handle(
        buildLogRecord({
          level: LogLevel.INFO,
          context: "Test",
          message: "test message",
        })
      );

      expect(mock).toHaveBeenCalledWith("Test - test message");

      mock.mockRestore();
    });

    it("should use the correct default format", () => {
      const mock = jest.spyOn(global.console, "info").mockImplementation();
      const handler = new ConsoleHandler(LogLevel.INFO);
      const record = buildLogRecord({ level: LogLevel.INFO });

      handler.handle(record);

      expect(mock).toHaveBeenCalledWith(
        `${record.date.toISOString()}\t[${record.context}]\t${record.message}`
      );

      mock.mockRestore();
    });
  });

  describe("handle", () => {
    it("should not handle a record with a lower level", () => {
      const mock = jest.spyOn(global.console, "info").mockImplementation();
      const handler = new ConsoleHandler(LogLevel.ERROR);

      handler.handle(buildLogRecord({ level: LogLevel.INFO }));

      expect(mock).not.toHaveBeenCalled();

      mock.mockRestore();
    });

    type Handle = "trace" | "debug" | "info" | "warn" | "error";
    const tests: [LogLevel, Handle][] = [
      [LogLevel.TRACE, "trace"],
      [LogLevel.DEBUG, "debug"],
      [LogLevel.INFO, "info"],
      [LogLevel.WARNING, "warn"],
      [LogLevel.ERROR, "error"],
      [LogLevel.CRITICAL, "error"],
    ];

    it.each(tests)(
      "should handle level %d with console method %s",
      (level, handle) => {
        const mock = jest.spyOn(global.console, handle).mockImplementation();
        const handler = new ConsoleHandler(LogLevel.TRACE);
        const record = buildLogRecord({ level });

        handler.handle(record);

        expect(mock).toHaveBeenCalledTimes(1);

        mock.mockRestore();
      }
    );
  });

  describe("toggle", () => {
    it("should toggle of all ConsoleHandlers explicitly", () => {
      const mock = jest.spyOn(global.console, "info").mockImplementation();
      const handler1 = new ConsoleHandler(LogLevel.TRACE);
      const handler2 = new ConsoleHandler(LogLevel.TRACE);

      ConsoleHandler.toggle(false);
      handler1.handle(buildLogRecord({ level: LogLevel.INFO }));
      handler2.handle(buildLogRecord({ level: LogLevel.INFO }));

      expect(mock).not.toHaveBeenCalled();

      // Restore the toggle so we do not break other tests as it is a static property.
      ConsoleHandler.toggle(true);
      mock.mockRestore();
    });

    it("should toggle of all ConsoleHandlers implicitly", () => {
      const mock = jest.spyOn(global.console, "info").mockImplementation();
      const handler1 = new ConsoleHandler(LogLevel.TRACE);
      const handler2 = new ConsoleHandler(LogLevel.TRACE);

      ConsoleHandler.toggle();
      handler1.handle(buildLogRecord({ level: LogLevel.INFO }));
      handler2.handle(buildLogRecord({ level: LogLevel.INFO }));

      expect(mock).not.toHaveBeenCalled();

      // Restore the toggle so we do not break other tests as it is a static property.
      ConsoleHandler.toggle(true);
      mock.mockRestore();
    });
  });
});
