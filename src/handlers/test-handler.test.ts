import { TestHandler } from "./test-handler";
import { buildLogRecord } from "../test-helper/log-record-builder";
import { LogLevel } from "../log-level";

describe("TestHandler", () => {
  it("should initialize its level to the given level or level array", () => {
    const handler = new TestHandler(LogLevel.ERROR);
    const handler2 = new TestHandler([LogLevel.ERROR, LogLevel.DEBUG]);

    expect(handler.level).toBe(LogLevel.ERROR);
    expect(handler2.level).toEqual([LogLevel.ERROR, LogLevel.DEBUG]);
  });

  it("should have an empty record array after initialization", () => {
    const handler = new TestHandler();

    expect(handler.records).toEqual([]);
  });

  it("should use TRACE as an default level", () => {
    const handler = new TestHandler();

    expect(handler.level).toBe(LogLevel.TRACE);
  });

  it("adds a given record into a record array", () => {
    const handler = new TestHandler();
    const record = buildLogRecord();

    handler.handle(record);

    expect(handler.records).toContain(record);
  });
});
