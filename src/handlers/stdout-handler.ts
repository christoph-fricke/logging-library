import { BaseHandler } from "../handler";
import { ILogRecord } from "../log-record";
import { LogLevel } from "../log-level";

export class StdoutHandler extends BaseHandler {
  constructor(level: LogLevel | LogLevel[]) {
    super(level);

    if (typeof process === "undefined") {
      throw new Error(
        `${StdoutHandler.name} is supposed to run in Node. However 'process' is undefined.`
      );
    }
  }

  protected log(record: ILogRecord): void {
    process.stdout.write(JSON.stringify(record) + "\n");
  }
}
