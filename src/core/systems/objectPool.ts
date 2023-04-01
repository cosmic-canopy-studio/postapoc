// Part: src/core/systems/objectPool.ts
// Code Reference:
// Documentation:

import { getLogger } from '@src/core/components/logger';

export default class ObjectPool<T> {
  private logger = getLogger('ObjectPool');
  private pool: T[];
  private factory: () => T;

  constructor(factory: () => T, initialSize?: number) {
    this.pool = [];
    this.factory = factory;

    if (initialSize && initialSize > 0) {
      this.createInitialObjects(initialSize);
    }
  }

  get(): T {
    let item: T;
    if (this.pool.length === 0) {
      item = this.factory();
    } else {
      item = this.pool.pop() as T;
    }
    this.logger.debug('Got object from pool');
    return item;
  }

  release(item: T): void {
    this.pool.push(item);
    this.logger.debug('Released object back to pool');
  }

  size(): number {
    this.logger.debug(`Object pool size: ${this.pool.length}`);
    return this.pool.length;
  }

  clear(): void {
    this.pool = [];
    this.logger.debug('Cleared object pool');
  }

  private createInitialObjects(size: number): void {
    for (let i = 0; i < size; i++) {
      this.pool.push(this.factory());
    }
    this.logger.debug(`Created ${size} initial objects`);
  }
}
