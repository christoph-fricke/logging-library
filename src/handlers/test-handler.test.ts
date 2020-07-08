import { TestHandler } from "./test-handler";
import { buildLogRecord } from "../test-helper/log-record-builder";
import { LogLevel } from "../log-level";

describe("TestHandler", () => {
  it("should have an empty record array after initialization", () => {
    const handler = new TestHandler();

    expect(handler.records).toEqual([]);
  });

  it("adds a given record into a record array", () => {
    const handler = new TestHandler();
    const record = buildLogRecord();

    handler.handle(record);

    expect(handler.records).toContain(record);
  });

  it("should use VERBOSE as an default level", () => {
    const handler = new TestHandler();

    expect(handler.level).toBe(LogLevel.VERBOSE);
  });

  it("should not add a record with a lower level", () => {
    const handler = new TestHandler(LogLevel.WARNING);
    const record = buildLogRecord({ level: LogLevel.INFO });

    handler.handle(record);

    expect(handler.records).toEqual([]);
  });
});
