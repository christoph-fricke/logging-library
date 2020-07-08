import { LogRecord } from "./log-record";
import { LogLevel } from "./log-level";

describe("LogRecord", () => {
  it("should construct a valid LogRecord", () => {
    const record = new LogRecord("test message", {
      level: LogLevel.INFO,
      context: "Test",
      metadata: { key1: 123 },
    });

    expect(record.level).toBe(LogLevel.INFO);
    expect(record.levelName).toBe("INFO");
    expect(record.context).toBe("Test");
    expect(record.message).toBe("test message");
  });

  it("should include the current date", () => {
    const date = new Date("2020-04-01T12:15:32.000Z");
    jest.useFakeTimers("modern");
    jest.setSystemTime(date);

    const record = new LogRecord("test message", {
      level: LogLevel.INFO,
      context: "Test",
      metadata: { key1: 123 },
    });

    expect(record.date).toStrictEqual(date);
  });
});
