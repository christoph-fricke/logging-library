import { ILogger } from "./logger";

export class LoggerManager {
  private static store: Map<string, ILogger>;

  static get(key: string): ILogger | undefined {
    return this.store.get(key);
  }

  static add(key: string, logger: ILogger) {
    this.store.set(key, logger);
  }

  static remove(key: string): boolean {
    return this.store.delete(key);
  }
}
