import { BaseHandler } from "./handler";
import { LogLevel } from "./log-level";
import { buildLogRecord } from "./test-helper/log-record-builder";

const logMock = jest.fn();
class SpyHandler extends BaseHandler {
  // Little SpyHandler to test BaseHandler since BaseHandler is abstract.
  // We want to test BaseHandler as it implements crucial logic that
  // user handler might rely on.
  log = logMock;
}

describe("BaseHandler", () => {
  it("should accept a level as a constructor argument", () => {
    const handler = new SpyHandler(LogLevel.INFO);

    expect(handler.level).toBe(LogLevel.INFO);
  });

  it("should accept an level array as a constructor argument", () => {
    const handler = new SpyHandler([LogLevel.INFO, LogLevel.CRITICAL]);

    expect(handler.level).toEqual([LogLevel.INFO, LogLevel.CRITICAL]);
  });

  describe("handle", () => {
    it("should delegate logging to a subclass if the record level is equal to the given level", () => {
      const handler = new SpyHandler(LogLevel.INFO);
      const record = buildLogRecord({ level: LogLevel.INFO });

      handler.handle(record);

      expect(logMock).toHaveBeenCalledTimes(1);
      expect(logMock).toHaveBeenCalledWith(record);
    });

    it("should delegate logging to a subclass if the record level is greater than the given level", () => {
      const handler = new SpyHandler(LogLevel.INFO);
      const record = buildLogRecord({ level: LogLevel.ERROR });
      const record2 = buildLogRecord({ level: LogLevel.WARNING });

      handler.handle(record);
      handler.handle(record2);

      expect(logMock).toHaveBeenCalledTimes(2);
      expect(logMock).toHaveBeenCalledWith(record);
      expect(logMock).toHaveBeenCalledWith(record2);
    });

    it("should not not delegate logging to a subclass if the record level is less than the given level", () => {
      const handler = new SpyHandler(LogLevel.ERROR);
      const record = buildLogRecord({ level: LogLevel.INFO });
      const record2 = buildLogRecord({ level: LogLevel.WARNING });

      handler.handle(record);
      handler.handle(record2);

      expect(logMock).toHaveBeenCalledTimes(0);
    });

    it("should delegate logging to a subclass if the record level is included in the given array", () => {
      const handler = new SpyHandler([LogLevel.INFO, LogLevel.CRITICAL]);
      const record = buildLogRecord({ level: LogLevel.INFO });
      const record2 = buildLogRecord({ level: LogLevel.CRITICAL });

      handler.handle(record);
      handler.handle(record2);

      expect(logMock).toHaveBeenCalledTimes(2);
      expect(logMock).toHaveBeenCalledWith(record);
      expect(logMock).toHaveBeenCalledWith(record2);
    });

    it("should not delegate logging to a subclass if the record level is not included in the given array", () => {
      const handler = new SpyHandler([LogLevel.INFO, LogLevel.CRITICAL]);
      const record = buildLogRecord({ level: LogLevel.WARNING });

      handler.handle(record);

      expect(logMock).toHaveBeenCalledTimes(0);
    });
  });
});
