// Part: src/phaser/factories/itemFactory.ts
// Code Reference:
// Documentation:

import { Item } from '@src/ecs/components/item';
import ObjectPool from '@src/core/systems/objectPool';
import items from '@src/data/items.json';
import {getSprite} from "@src/ecs/components/phaserSprite";
import {getLogger} from "@src/core/components/logger";

export class ItemFactory {
  private itemPool: ObjectPool<Item>;
  private logger = getLogger('ItemFactory')

  constructor() {
    this.itemPool = new ObjectPool<Item>(() => new Item('', '', 0, 0, ''));
  }

  createItem(id: string): Item {
    const itemConfig = items.items.find((item) => item.id === id);
    if (!itemConfig) {
      throw new Error(`Item config not found for id: ${id}`);
    }
    this.logger.debug(`Creating item ${id} with config: ${JSON.stringify(itemConfig)}`)
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
    this.logger.debug(`Releasing item ${item.id}`)
    this.itemPool.release(item);
  }

  createItemFromEntity(eid: number): Item {
    const texture = getSprite(eid).texture.key;
    this.logger.debug(`Creating item from entity ${eid} with texture: ${texture}`)
    return this.createItem(texture);
  }

}
