import { WriteStream, createWriteStream, PathLike } from "fs";
import { BaseHandler } from "../handler";
import { ILogRecord } from "../log-record";
import { LogLevel } from "../log-level";

interface IFileHandlerOptions {
  filepath: PathLike;
  format?: (record: ILogRecord) => string;
}

export class FileHandler extends BaseHandler {
  private readonly _stream: WriteStream;
  private readonly format: (record: ILogRecord) => string;

  constructor(level: LogLevel | LogLevel[], options: IFileHandlerOptions) {
    super(level);
    this.format = options?.format ?? this.defaultFormat;
    this._stream = createWriteStream(options.filepath, {
      autoClose: true,
      flags: "a",
    });
  }

  protected log(record: ILogRecord): void {
    this._stream.write(`${this.format(record)}\n`);
  }

  private defaultFormat(record: ILogRecord): string {
    return JSON.stringify(record);
  }
}
