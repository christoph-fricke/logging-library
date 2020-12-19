import { LogRecord } from "./log-record";
import { LogLevel } from "./log-level";

describe("LogRecord", () => {
  it("should construct a valid LogRecord", () => {
    const record = new LogRecord(["test message"], {
      level: LogLevel.INFO,
      context: "Test",
      metadata: { key1: 123 },
    });

    expect(record.level).toBe(LogLevel.INFO);
    expect(record.levelName).toBe("INFO");
    expect(record.context).toBe("Test");
    expect(record.message).toBe("test message");
    expect(record.args).toStrictEqual(["test message"]);
  });

  it("should include the current date", () => {
    const date = new Date("2020-04-01T12:15:32.000Z");
    jest.useFakeTimers("modern");
    jest.setSystemTime(date);

    const record = new LogRecord(["test message"], {
      level: LogLevel.INFO,
      context: "Test",
      metadata: { key1: 123 },
    });

    expect(record.date).toStrictEqual(date);
  });

  const cases: [args: unknown[], parsed: string][] = [
    [[], ""],
    [["log message"], "log message"],
    [["message1", "message2"], "message1 message2"],
    [[true, false], "true false"],
    [[1, 2], "1 2"],
    [[(a: number, b: number) => a + b], "[Function (anonymous)]"],
    [[[]], "[]"],
    [[{}], "{}"],
    [[{ key: 1, key2: 2 }], '{"key":1,"key2":2}'],
    [[null], "null"],
    [[undefined, 1], "undefined 1"],
    [
      [
        function sum(a: number, b: number) {
          return a + b;
        },
      ],
      "[Function sum]",
    ],
    [
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      "[1,2,3] [4,5,6]",
    ],
  ];

  it.each(cases)('Given arguments "%s" are parsed to "%s"', (args, parsed) => {
    const record = new LogRecord(args, {
      context: "default",
      level: LogLevel.INFO,
      metadata: {},
    });

    expect(record.message).toBe(parsed);
  });
});
