import { Logger } from "./logger";
import { TestHandler } from "./handlers/test-handler";
import { LogLevel } from "./log-level";

describe("Logger", () => {
  it('should be created with the context "Default"', () => {
    const logger = new Logger();

    expect(logger.context).toBe("Default");
  });

  it("should accept a context value when constructed", () => {
    const logger = new Logger("Test");

    expect(logger.context).toBe("Test");
  });

  describe("addHandler", () => {
    it("returns the same logger instance for a fluent interface", () => {
      const logger = new Logger();

      const res = logger.addHandler(new TestHandler());

      expect(res).toBe(logger);
    });

    it("adds a given handler to the logger", () => {
      const handler = new TestHandler();
      const logger = new Logger().addHandler(handler);

      // We can't observe the handler list as it is internal. So we check if the handler is called.
      logger.debug("test message");
      expect(handler.records).toHaveLength(1);
    });

    it("adds a given handler if the condition is true", () => {
      const handler = new TestHandler();
      const logger = new Logger().addHandler(handler, true);
      const logger2 = new Logger().addHandler(handler, () => true);

      // We can't observe the handler list as it is internal. So we check if the handler is called.
      logger.debug("test message");
      logger2.debug("test message");
      expect(handler.records).toHaveLength(2);
    });

    it("does not add a given handler if the condition is false", () => {
      const handler = new TestHandler();
      const logger = new Logger().addHandler(handler, false);
      const logger2 = new Logger().addHandler(handler, () => false);

      // We can't observe the handler list as it is internal. So we check if the handler is called.
      logger.debug("test message");
      logger2.debug("test message");
      expect(handler.records).toHaveLength(0);
    });
  });

  describe("withContext", () => {
    it("returns a logger with the given context", () => {
      const logger = new Logger();

      const res = logger.withContext("Test");

      expect(res.context).toBe("Test");
    });

    it("does not return the same logger instance", () => {
      const logger = new Logger();

      const res = logger.withContext("Test");

      expect(res).not.toBe(logger);
    });

    it("copies all handlers to the new instance", () => {
      const handler = new TestHandler();
      const logger = new Logger().addHandler(handler);

      const res = logger.withContext("Test");

      res.debug("test message");
      expect(handler.records).toHaveLength(1);
    });
  });

  type Method = "trace" | "debug" | "info" | "warning" | "error" | "critical";
  const tests: [Method, string | Error, LogLevel][] = [
    ["trace", "test message", LogLevel.TRACE],
    ["debug", "test message", LogLevel.DEBUG],
    ["info", "test message", LogLevel.INFO],
    ["warning", "test message", LogLevel.WARNING],
    ["error", "test message", LogLevel.ERROR],
    ["error", new Error("test Error"), LogLevel.ERROR],
    ["critical", "test message", LogLevel.CRITICAL],
    ["critical", new Error("test Error"), LogLevel.CRITICAL],
  ];

  describe.each(tests)("%s", (method, msg, level) => {
    it(`creates a log record with the given message and level ${level}`, () => {
      const handler = new TestHandler();
      const logger = new Logger().addHandler(handler);

      if (typeof msg === "string") {
        logger[method](msg as string);

        expect(handler.records[0].msg).toBe(msg);
        expect(handler.records[0].level).toBe(level);
      } else {
        // We have an error object as msg which is only for error or critical.
        logger[method as "error" | "critical"](msg);

        expect(handler.records[0].msg).toBe(msg.message);
        expect(handler.records[0].level).toBe(level);
      }
    });

    it("should notify all configured handlers", () => {
      const handler1 = new TestHandler();
      const handler2 = new TestHandler();
      const logger = new Logger().addHandler(handler1).addHandler(handler2);

      // We don't care if msg is an error in error and critical case.
      logger[method](msg as string);

      expect(handler1.records).toHaveLength(1);
      expect(handler2.records).toHaveLength(1);
    });
  });
});
