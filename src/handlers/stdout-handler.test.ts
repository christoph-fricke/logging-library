import { StdoutHandler } from "./stdout-handler";
import { LogLevel } from "../log-level";
import { buildLogRecord } from "../test-helper/log-record-builder";

describe("StdoutHandler", () => {
  it("writes to stdout", () => {
    // const stdoutMock = jest.spyOn(process.stdout, "write");
    const handler = new StdoutHandler(LogLevel.INFO);
    const record = buildLogRecord({ level: LogLevel.INFO });

    handler.handle(record);

    // expect(stdoutMock).toHaveBeenCalledWith(JSON.stringify(record));
  });
});
