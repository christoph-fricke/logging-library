# logging-library

[![GitHub issues](https://flat.badgen.net/github/open-issues/christoph-fricke/logging-library)](https://github.com/christoph-fricke/logging-library/issues)
[![npm version](https://flat.badgen.net/npm/v/logging-library)](https://www.npmjs.com/package/logging-library)
![Dependencies](https://flat.badgen.net/david/dep/christoph-fricke/logging-library)
![BundleSize](https://flat.badgen.net/bundlephobia/minzip/logging-library)

> Extensible logging module for **Node**, **Deno** and **browsers**. Inspired by
> Deno std/log and .Net Core `ILogger`.

## Goals

- Provide a simple, clean and extensible logging api.
- Class based, [fluent interface](https://wikipedia.org/wiki/Fluent_interface)
  api.
- Zero dependencies.
- Support for log scoping via contexts.
- Support for different log levels.
- Support for custom handlers so the api can be used in a wide range of
  szenarios.

## Features

1. Written in TypeScript with a **fully typed**, **class based** api.
1. Create custom log handlers. Included are a `ConsoleHandler` and
   `TestHandler`.
1. Six different log levels. `VERBOSE`, `DEBUG`, `INFO`, `WARNING`, `ERROR` and
   `CRITICAL`.
1. Attach any metadata to you logs for advanced, structured logging.
1. [Fluent interface](https://wikipedia.org/wiki/Fluent_interface) for easy
   configuration.
1. Manage multiple logger instances globally within the `LoggerStore`.

## Upcoming features

1. Exported default logger which can be overwritten.
1. More handlers directly provided.
1. Your idea? Let me know!

## Installation

```bash
npm i logging-library
# or
yarn add logging-library
```

## Usage

> More examples can be found in the `examples` folder.

Basic usage:

```typescript
import { Logger, ConsoleHandler, LogLevel } from "logging-library";

// Create a logger instance and attach a console handler with level INFO and above as well
// as a custom handler with level WARN.
const logger = new Logger()
  .addHandler(new ConsoleHandler(LogLevel.INFO))
  .addHandler(new CustomHandler([LogLevel.WARN, LogLevel.INFO]));
// A handler can also be configured to only work for specific levels by passing in an array like above.

// addHandler takes an optional second argument which determines where the handler is
// actually added. Might be useful to only add a logger in Development. Example:
const logger2 = new Logger().addHandler(
  new ConsoleHandler(LogLevel.INFO),
  process.env.NODE_ENV === "development"
);

// Creates a LogRecord with level INFO that is passed to all handlers.
logger.info("Some log using the default context.");
// [Default]   Some log using the default context.

// Create a scoped logger that inherits its config from `logger`. Sets the context
// to 'Authentication' in all LogRecords created by this logger.
const scoped = logger.withContext("Authentication");

scoped.warning("This log is using the 'Authentication' context");
// [Authentication]  This log is using the 'Authentication' context

scoped.debug("Some debug information");
// No log output, since the ConsoleHandler requires at log level INFO
```

Usage with the `LoggerStore`:

```typescript
import { Logger, ConsoleHandler, LogLevel, LoggerStore } from "logging-library";

// Create a logger instance and attach a console handler with level INFO.
const logger = new Logger().addHandler(new ConsoleHandler(LogLevel.INFO));
LoggerStore.add("console", logger);

// Somewhere else in a file far far away...
const logger = LoggerStore.get("console");

// Start logging
logger.info("Some log using the default context.");
// [Default]   Some log using the default context.

// And/Or create scopes
const scoped = logger.withContext("Authentication");

// Nobody stops you from storing the scoped logger if needed...
LoggerStore.add("auth", scoped);
```

## Provide a custom format:

You can change the output format of the `ConsoleHandler` by providing a custom
format function in a second `options argument`.

```typescript
const myFormat = (record: ILogRecord) =>
  `${record.levelName} - ${record.message}`; // Return you custom format as a string.

const logger = new Logger().addHandler(
  new ConsoleHandler(LogLevel.INFO, { format: myFormat })
);

logger.info("With custom format.");
// INFO - With custom format.
```

## Create a custom handler:

Currently this library supports a `ConsoleHandler` and `TestHandler` with more
to come.

This library is build for extensible so you are welcome to create you custom
handlers to meet you needs. More exotic handlers might send the logs to
analytics or an error reporting tool.

Every handler must implement the `ILogHandler` interface to be usable.

```typescript
interface ILogHandler {
  readonly level: LogLevel | LogLevel[];
  handle(record: ILogRecord): void;
}
```

This library provides an abstract `BaseHandler` class. It takes care of
implementing the interface and filters all `LogRecords` that does not meet the
required level. If you extend this class you only have to implement a `log`
method which is called for all passed `LogRecords`.

```typescript
import { BaseHandler } from "logging-library";

class CustomHandler extends BaseHandler {
  constructor(level: LogLevel | LogLevel[]) {
    super(level);
  }

  // Method can also be public. I recommend protected as it does not need to be
  // visible when instantiated.
  protected log(record: ILogRecord) {
    // ... Do whatever you like with the record. See src/handlers for inspiration.
  }
}
```

## Attaching metadata:

This library attaches a `metadata` object to every created log record. Metadata
can store any information you need. Add multiple metadata objects will merge the
objects together with "new" objects overwriting keys of "old" objects.

```typescript
// Metadata is provided to all handlers in the metadata property of a record
class MetaHandler extends BaseHandler {
  constructor(level: LogLevel | LogLevel[]) {
    super(level);
  }

  protected log(record: ILogRecord) {
    console.log(record.metadata);
  }
}

const logger = new Logger()
  .addMetadata({ pid: 123, hostname: "example.com" })
  .addMetadata({ key1: "Some more meta" })
  .addHandler(new MetaHandler(LogLevel.INFO));

// Allows you to check the current metadata in case you need to.
logger.metadata; // { pid: 123, hostname: "example.com", key1: "Some more meta" }

logger.info("Test message");
// Log from MetaHandler: { pid: 123, hostname: "example.com", key1: "Some more meta" }
```

## Api (Also see [reference](https://logging-library.vercel.app))

### `Loglevel`

Enum containing all valid log levels. Handlers that require a higher level than
provided in a log record will not handle the record. All enum values from low to
high:

```
VERBOSE = 10
DEBUG = 20
INFO = 30
WARNING = 40
ERROR = 50
CRITICAL = 60
```

### `ILogger`

Interface that every logger implements.

```typescript
interface ILogger {
  verbose(...args: unknown[]): void;
  debug(...args: unknown[]): void;
  info(...args: unknown[]): void;
  warning(...args: unknown[]): void;
  error(...args: unknown[]): void;
  critical(...args: unknown[]): void;

  withContext(context: string): ILogger;
  addHandler(
    handler: ILogHandler,
    condition?: boolean | (() => boolean)
  ): ILogger;
  addMetadata(metadata: Record<string, unknown>): ILogger;

  readonly context: string;
  readonly metadata: Record<string, unknown>;
}
```

### `LoggerStore`

> Little helper class that uses a static map to store loggers globally. Using
> the same key twice, overrides a logger.

```typescript
class LoggerStore {
  static add(key: string, logger: ILogger): void;
  static get(key: string): ILogger | undefined;
  static remove(key: string): boolean;
}
```

### `ILogRecord`

Every message logged by a logger is transformed into an object that implements
`ILogRecord`. The constructed record is passed to every handler.

```typescript
interface ILogRecord {
  /** Level used to create this record. */
  readonly level: LogLevel;
  /** String representation of the level. */
  readonly levelName: keyof typeof LogLevel;
  /** Context used for this record. */
  readonly context: string;
  /** Arguments that were passed to the logger. */
  readonly args: unknown[];
  /** Arguments formatted as a string. */
  readonly message: string;
  /** Timestamp at which the log record was created. */
  readonly date: Date;
  /** Extra meta data configured with a logger. */
  readonly metadata: Record<string, unknown>;
}
```

### ConsoleHandler

> Logs records the the corresponding method on the `console` object.

Requires a min. LogLevel when initialized. Everything below this level will not
be logged. Accepts an optional `options object` as a second argument.

```typescript
interface IConsoleHandlerOptions {
  format?: (record: ILogRecord) => string;
}
```

You can change the output format by providing a `format` function as an
`option`. Default output format is: `level: [context] - message`.

The `ConsoleHandler` classed has a static `toggle` method with might be used in
a browser to toggle of all logs in production but toggle them back on with a
global function if needed. The `toggle` method returns a boolean, indicating
whether console handlers are on or off after the call. Example for a global
function in Typescript:

```typescript
declare global {
  function toggleConsoleLogging(active?: boolean): void;
}

globalThis.toggleConsoleLogging = ConsoleHandler.toggle;
```

### TestHandler

> Handler that writes all logs into a message queue which. Allows for assertions
> about logs during testing.

```typescript
class TestHandler extends BaseHandler {
  public readonly records: ILogRecord[] = [];

  constructor(level: LogLevel | LogLevel[] = LogLevel.VERBOSE) {
    super(level);
  }

  protected log(record: ILogRecord) {
    this.records.push(record);
  }
}
```
