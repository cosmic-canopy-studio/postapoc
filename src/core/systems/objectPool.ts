// Part: src/core/systems/objectPool.ts

import { getLogger } from "@src/core/components/logger";

export default class ObjectPool<T extends { deinitialize: () => void }> {
  private logger = getLogger("ObjectPool");
  private pool: T[];
  private factory: () => T;

  constructor(factory: () => T) {
    this.pool = [];
    this.factory = factory;
  }

  get(): T {
    let item: T;
    if (this.pool.length === 0) {
      item = this.factory();
    } else {
      item = this.pool.pop() as T;
    }
    this.logger.debug("Got object from pool");
    return item;
  }

  release(item: T): void {
    item.deinitialize();
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

