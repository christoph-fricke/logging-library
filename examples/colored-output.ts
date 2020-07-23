// The console output can be colored by providing a custom formatter.
// This example uses chalk to color the output.

import { Logger, ConsoleHandler, LogLevel, ILogRecord } from "logging-library";
import * as chalk from "chalk";

const colored = (r: ILogRecord) =>
  `${chalk.bold.blue(r.levelName)}\t- ${chalk.red(r.context)}: ${r.message}`;

const logger = new Logger().addHandler(
  new ConsoleHandler(LogLevel.DEBUG, {
    format: colored,
  })
);

logger.info("This output will appear colored in the console. :D");
