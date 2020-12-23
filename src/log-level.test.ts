import { LogLevel, getLogLevelName } from "./log-level";

describe("getLogLevelName", () => {
  const tests: [LogLevel, keyof typeof LogLevel][] = [
    [LogLevel.DEBUG, "DEBUG"],
    [LogLevel.INFO, "INFO"],
    [LogLevel.WARN, "WARN"],
    [LogLevel.ERROR, "ERROR"],
  ];

  it.each(tests)("Level %d return the name %s", (level, name) => {
    expect(getLogLevelName(level)).toBe(name);
  });

  it("should throw an error for an invalid level", () => {
    expect(() => getLogLevelName(100)).toThrow();
  });
});
