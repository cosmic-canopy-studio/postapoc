// Part: src/core/world/objectPool.ts

import logger from "@src/core/logger";

export default class ObjectPool<T> {
  private pool: T[];
  private factory: () => T;

  constructor(factory: () => T, initialSize = 0) {
    this.pool = [];
    this.factory = factory;

    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.factory());
    }
    logger.debug(`Object pool created with initial size: ${initialSize}`);
  }

  get(): T {
    if (this.pool.length === 0) {
      this.pool.push(this.factory());
    }
    logger.debug("Retrieved object from pool");
    return this.pool.pop() as T;
  }

  release(item: T): void {
    this.pool.push(item);
    logger.debug("Released object back to pool");
  }

  size(): number {
    return this.pool.length;
  }

  clear(): void {
    this.pool = [];
  }
}
