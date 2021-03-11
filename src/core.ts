/**
 * Checked against Console, pino, wingston, loglevel, bunyan
 */
export interface CoreLogger {
  debug(...args: unknown[]): void;
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
}

type LoggerIdentifier = string | symbol;
type Assignment = (id?: LoggerIdentifier) => CoreLogger;

const sym = Symbol.for("logging-library_v1");

/**
 * Assigns a logger to a given identifier and returns the logger. The way an
 * identifier is assigned is configured with `setLoggerAssignment`.
 *
 * Returns the `console` object if no assignment is specified.
 *
 * @param id Identifier which determines the assigned logger. Package authors
 * should use their package name.
 */
export function getLogger(id?: LoggerIdentifier): CoreLogger {
  //@ts-ignore I couldn't figure out how to type a symbol key on the global namespace
  const resolver: Assignment | undefined = globalThis[sym];

  return resolver?.(id) ?? console;
}

/**
 * Sets an assignment function that is used to assign a `Logger` instance to an
 * identifier.
 */
export function setLoggerAssignment(assignment: Assignment): void {
  //@ts-ignore I couldn't figure out how to type a symbol key on the global namespace
  globalThis[sym] = assignment;
}
