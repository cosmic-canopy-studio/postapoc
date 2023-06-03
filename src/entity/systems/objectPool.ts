import { getLogger } from '@src/telemetry/systems/logger';

export default class ObjectPool<T> {
  private logger = getLogger('entity');
  private pool: T[];
  private readonly factory: () => T;

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
      this.logger.debugVerbose('Object pool created new object');
    } else {
      item = this.pool.pop() as T;
      this.logger.debugVerbose('Object pool reused object');
    }
    return item;
  }

  release(item: T): void {
    this.pool.push(item);
    this.logger.debugVerbose('Released object back to pool');
  }

  size(): number {
    this.logger.debugVerbose(`Object pool size: ${this.pool.length}`);
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
    this.logger.debugVerbose(`Created ${size} initial objects`);
  }
}
