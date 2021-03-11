import { Logger } from "./logger";
import { getLogger, setLoggerAssignment } from "./core";

afterEach(() => {
  // Reset the global namespace after each tests, so assignments do not bleed
  // into another test.
  //@ts-ignore
  globalThis[Symbol.for("logging-library_v1")] = undefined;
});

test("getLogger should return the console if no assignment is specified", () => {
  const logger = getLogger("test logger");

  expect(logger).toBe(console);
});

test("getLogger should call a specified assignment", () => {
  const assignment = jest.fn();
  const id = "logger";
  
  setLoggerAssignment(assignment);
  getLogger(id);

  expect(assignment).toHaveBeenCalledTimes(1);
  expect(assignment).toHaveBeenCalledWith(id);
});

test("getLogger should return the logger returned by an assignment", () => {
  const logger = new Logger();
  const assignment = jest.fn().mockReturnValue(logger);

  setLoggerAssignment(assignment);
  const assigned = getLogger();

  expect(assigned).toBe(logger);
});
