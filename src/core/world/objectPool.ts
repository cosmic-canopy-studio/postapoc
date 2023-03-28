import { getLogger } from "@src/core/devTools/logger";

export default class ObjectPool<T> {
  private logger = getLogger("ObjectPool");
  private pool: T[];
  private factory: () => T;

  constructor(factory: () => T) {
    this.pool = [];
    this.factory = factory;
  }

  get(): T {
    if (this.pool.length === 0) {
      this.pool.push(this.factory());
    }
    this.logger.debug("Got object from pool");
    return this.pool.pop() as T;
  }

  release(item: T): void {
    this.pool.push(item);
    this.logger.debug("Released object back to pool");
  }

  size(): number {
    this.logger.debug(`Object pool size: ${this.pool.length}`);
    return this.pool.length;
  }

  clear(): void {
    this.pool = [];
    this.logger.debug("Cleared object pool");
  }
}
