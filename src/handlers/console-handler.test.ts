import { ConsoleHandler } from "./console-handler";
import { LogLevel } from "../log-level";
import { buildLogRecord } from "../test-helper/log-record-builder";
import { ILogRecord } from "../log-record";

describe("ConsoleHandler", () => {
  it("should initialize its level to the given level or level array", () => {
    const handler = new ConsoleHandler(LogLevel.ERROR);
    const handler2 = new ConsoleHandler([LogLevel.ERROR, LogLevel.DEBUG]);

    expect(handler.level).toBe(LogLevel.ERROR);
    expect(handler2.level).toStrictEqual([LogLevel.ERROR, LogLevel.DEBUG]);
  });

  describe("format", () => {
    const mock = jest.spyOn(global.console, "info").mockImplementation();

    afterEach(() => {
      mock.mockReset();
    });

    afterAll(() => mock.mockRestore());

    it("should be able to use a custom format", () => {
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

      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveBeenCalledWith("Test - test message");
    });

    it("should use the correct default format", () => {
      const handler = new ConsoleHandler(LogLevel.INFO);
      const record = buildLogRecord({ level: LogLevel.INFO });

      handler.handle(record);

      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveBeenCalledWith(
        `${record.levelName}: [${record.context}] - ${record.message}`
      );
    });
  });

  describe("handle", () => {
    type Handle = "debug" | "info" | "warn" | "error";
    const tests: [LogLevel, Handle][] = [
      [LogLevel.DEBUG, "debug"],
      [LogLevel.INFO, "info"],
      [LogLevel.WARN, "warn"],
      [LogLevel.ERROR, "error"],
    ];

    it.each(tests)(
      "should handle level %d with console method %s",
      (level, handle) => {
        const mock = jest.spyOn(global.console, handle).mockImplementation();
        const handler = new ConsoleHandler(LogLevel.DEBUG);
        const record = buildLogRecord({ level });

        handler.handle(record);

        expect(mock).toHaveBeenCalledTimes(1);

        mock.mockRestore();
      }
    );
  });

  describe("toggle", () => {
    const mock = jest.spyOn(global.console, "info").mockImplementation();

    beforeEach(() => {
      mock.mockReset();
      // Restore the toggle so we do not break other tests as it is a static property.
      ConsoleHandler.toggle(true);
    });

    afterAll(() => mock.mockRestore());

    it("should return the toggle result", () => {
      expect(ConsoleHandler.toggle(false)).toBe(false);
      expect(ConsoleHandler.toggle()).toBe(true);
    });

    it("should toggle of all ConsoleHandlers explicitly", () => {
      const handler1 = new ConsoleHandler(LogLevel.DEBUG);
      const handler2 = new ConsoleHandler(LogLevel.DEBUG);

      ConsoleHandler.toggle(false);
      handler1.handle(buildLogRecord({ level: LogLevel.INFO }));
      handler2.handle(buildLogRecord({ level: LogLevel.INFO }));

      expect(mock).not.toHaveBeenCalled();
    });

    it("should toggle of all ConsoleHandlers implicitly", () => {
      const handler1 = new ConsoleHandler(LogLevel.DEBUG);
      const handler2 = new ConsoleHandler(LogLevel.DEBUG);

      ConsoleHandler.toggle();
      handler1.handle(buildLogRecord({ level: LogLevel.INFO }));
      handler2.handle(buildLogRecord({ level: LogLevel.INFO }));

      expect(mock).not.toHaveBeenCalled();
    });
  });
});
