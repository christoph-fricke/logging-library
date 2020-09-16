import { ILogger } from "./logger";

/**
 * Helper to statically store loggers globally.
 */
export class LoggerStore {
  private static store: Map<string, ILogger> = new Map();

  /** Returns a logger if it exists for the give key. */
  static get(key: string): ILogger | undefined {
    return this.store.get(key);
  }

  /** Add a logger to the given key or overrides it. */
  static add(key: string, logger: ILogger): void {
    this.store.set(key, logger);
  }

  /**
   * Removes a logger for a given key.
   * @returns True if a logger was removed. False otherwise.
   * @deprecated There is no real reason to be able to dynamically remove a logger
   * as it is always statically added in code. To remove a logger just remove
   * the add statement which is more efficient and easier to reason about.
   */
  static remove(key: string): boolean {
    return this.store.delete(key);
  }
}
