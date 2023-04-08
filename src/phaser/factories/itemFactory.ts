// Part: src/phaser/factories/itemFactory.ts
// Code Reference:
// Documentation:

import { Item } from '@src/ecs/components/item';
import ObjectPool from '@src/core/systems/objectPool';
import items from '@src/config/items.json';

export class ItemFactory {
  private itemPool: ObjectPool<Item>;

  constructor() {
    this.itemPool = new ObjectPool<Item>(() => new Item('', '', 0, 0, ''));
  }

  createItem(id: string): Item {
    const itemConfig = items.items.find((item) => item.id === id);
    if (!itemConfig) {
      throw new Error(`Item config not found for id: ${id}`);
    }
    const item = this.itemPool.get();
    item.initialize(
      itemConfig.id,
      itemConfig.name,
      itemConfig.weight,
      itemConfig.volume,
      itemConfig.category
    );
    return item;
  }

  releaseItem(item: Item): void {
    this.itemPool.release(item);
  }
}
