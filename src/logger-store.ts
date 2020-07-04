import { ILogger } from "./logger";

export class LoggerStore {
  private static store: Map<string, ILogger> = new Map();

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
