import { ILogRecord } from "../log-record";
import { LogLevel, getLogLevelName } from "../log-level";

export function buildLogRecord(overrides?: Partial<ILogRecord>): ILogRecord {
  return {
    context: "Test Context",
    date: new Date(),
    level: LogLevel.DEBUG,
    levelName: getLogLevelName(overrides?.level ?? LogLevel.DEBUG),
    args: ["message", 123],
    message: "message 123",
    metadata: { test: "Test meta" },
    ...overrides,
  };
}
