import { Logger } from "./logger";
import { LoggerStore } from "./logger-store";

describe("LoggerStore", () => {
  it("should add a logger for a given key", () => {
    const logger = new Logger();

    LoggerStore.add("test", logger);

    expect(LoggerStore.get("test")).toBe(logger);
  });

  it("should remove a logger for a given key", () => {
    const logger = new Logger();

    LoggerStore.add("test", logger);
    LoggerStore.remove("test");

    expect(LoggerStore.get("test")).toBeUndefined();
  });
});
