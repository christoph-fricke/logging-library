import { Logger, ILogger, ConsoleHandler, LogLevel } from "../src";

class SomeService {
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger.withContext(SomeService.name);
  }

  doOperation() {
    // ...
    this.logger.info("Operation done.");
  }

  doSomeWonkyStuff() {
    try {
      // ...
      // Oh no it failed...
      throw new Error("Wonky stuff failed.");
    } catch (e) {
      this.logger.error(e);
    }
  }
}

function main() {
  const logger = new Logger().addHandler(new ConsoleHandler(LogLevel.DEBUG));

  const service = new SomeService(logger);
  service.doOperation();
  service.doSomeWonkyStuff();
}

main();
