import { ILogRecord } from "../log-record";
import { LogLevel } from "../log-level";

export function buildLogRecord(overrides?: Partial<ILogRecord>): ILogRecord {
  return {
    context: "Test Context",
    date: new Date(),
    level: LogLevel.DEBUG,
    msg: "Test message",
    ...overrides,
  };
}
