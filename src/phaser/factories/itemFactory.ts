// Part: src/phaser/factories/itemFactory.ts
// Code Reference:
// Documentation:

import { Item } from '@src/ecs/components/item';
import ObjectPool from '@src/core/systems/objectPool';

export class ItemFactory {
  private itemPool: ObjectPool<Item>;

  constructor() {
    this.itemPool = new ObjectPool<Item>(() => new Item('', '', 0, 0, ''));
  }

  createItem(
    id: string,
    name: string,
    weight: number,
    volume: number,
    category: string
  ): Item {
    const item = this.itemPool.get();
    item.initialize(id, name, weight, volume, category);
    return item;
  }

  releaseItem(item: Item): void {
    this.itemPool.release(item);
  }
}
