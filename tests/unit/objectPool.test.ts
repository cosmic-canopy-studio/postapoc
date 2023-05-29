import ObjectPool from '@src/entity/objectPool';

describe('Object Pool', () => {
  it('creates and manages an object pool', () => {
    const factory = () => ({ x: 0, y: 0 });
    const pool = new ObjectPool(factory, 5);
    expect(pool.size()).toBe(5);
    const obj = pool.get();
    expect(pool.size()).toBe(4);
    pool.release(obj);
    expect(pool.size()).toBe(5);
  });
});
