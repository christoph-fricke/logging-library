import { LogLevel, getLogLevelName } from "./log-level";

describe("getLogLevelName", () => {
  const tests: [LogLevel, keyof typeof LogLevel][] = [
    [LogLevel.VERBOSE, "VERBOSE"],
    [LogLevel.DEBUG, "DEBUG"],
    [LogLevel.INFO, "INFO"],
    [LogLevel.WARNING, "WARNING"],
    [LogLevel.ERROR, "ERROR"],
    [LogLevel.CRITICAL, "CRITICAL"],
  ];

  it.each(tests)("Level %d return the name %s", (level, name) => {
    expect(getLogLevelName(level)).toBe(name);
  });

  it("should throw an error for an invalid level", () => {
    expect(() => getLogLevelName(100)).toThrow();
  });
});
