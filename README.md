# TS-Logger

> Extendible logging module for Node and browsers. Inspired by Pino, Deno
> std/log and .Net Core ILogger.

## Goals

- Provide a simpel, extendable logging api.
- Support for log scoping via contexts.
- Support for different log levels.
- Support for different handlers so the api can be used in a wide range of
  szenarios.

## Features

1. Custom log handlers. Included are a `ConsoleHandler` and `TestHandler`.
2. Six different log levels. `TRACE`, `DEBUG`, `INFO`, `WARNING`, `ERROR` and
   `FATAL`.
3. [Fluent interface](https://wikipedia.org/wiki/Fluent_interface) for easy
   configuration.
4. Manage multiple logger configurations globally with `LoggerManager`.

## Example

```typescript
const logger = new Logger();
```
