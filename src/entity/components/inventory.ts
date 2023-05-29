import {
  addComponent,
  defineComponent,
  hasComponent,
  IWorld,
  Types,
} from 'bitecs';
import { removePhaserSprite } from '@src/entity/components/phaserSprite';
import { getLogger } from '@src/telemetry/logger';

export const Inventory = defineComponent({
  items: [Types.ui16, 256], // Array of 256 possible items (entities)
});

export function addToInventory(
  world: IWorld,
  entity: number,
  itemEntity: number
) {
  const logger = getLogger('entity');
  if (hasComponent(world, Inventory, entity)) {
    for (let i = 0; i < Inventory.items.length; i++) {
      if (Inventory.items[entity][i] === 0) {
        // 0 is used as a placeholder for no item
        Inventory.items[entity][i] = itemEntity;
        removePhaserSprite(itemEntity);
        break;
      }
    }
  } else {
    addComponent(world, Inventory, entity);
    Inventory.items[entity][0] = itemEntity;
    removePhaserSprite(itemEntity);
  }
  logger.info(`Added item ${itemEntity} to entity ${entity}'s inventory`);
  logger.debug(`Entity ${entity}'s inventory: ${Inventory.items[entity]}`);
}
