# logging-library

> Extendible logging module for Node and browsers. Inspired by Deno std/log and
> .Net Core `ILogger`.

## Goals

- Provide a simpel, clean, extendable logging api.
- Zero dependencies.
- Support for log scoping via contexts.
- Support for different log levels.
- Support for different handlers so the api can be used in a wide range of
  szenarios.

## Features

1. Written in Typescript with a fully typed api.
1. Custom log handlers. Included are a `ConsoleHandler` and `TestHandler`.
1. Six different log levels. `TRACE`, `DEBUG`, `INFO`, `WARNING`, `ERROR` and
   `FATAL`.
1. [Fluent interface](https://wikipedia.org/wiki/Fluent_interface) for easy
   configuration.
1. Manage multiple logger instances globally with the `LoggerStore`.

## Example

> More examples can be found in the `examples` folder.

```typescript
import { Logger, ILogger, ConsoleHandler, LogLevel } from "env-logger";

const logger = new Logger().addHandler(new ConsoleHandler(LogLevel.DEBUG));

logger.info("Some log using the default context.");
// [Default]   Some log using the default context.

const scoped = logger.withContext("Authentication");

scoped.warn("This log is using the 'Authentication' context");
// [Authentication]  This log is using the 'Authentication' context
```

## Api

Create a global toggle that can be used in production website to activate
console output on.

```typescript
declare global {
  function toggleConsoleLogging(state?: boolean): void;
}

globalThis.toggleConsoleLogging = ConsoleHandler.toggle;
```
