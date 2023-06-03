import {
  addComponent,
  defineComponent,
  hasComponent,
  IWorld,
  Types,
} from 'bitecs';
import { removePhaserSprite } from '@src/entity/components/phaserSprite';
import { getLogger } from '@src/telemetry/systems/logger';
import { getEntityNameWithID } from '@src/entity/components/names';

export const Inventory = defineComponent({
  items: [Types.ui16, 256], // Array of 256 possible items (entities)
});

export function addToInventory(
  world: IWorld,
  entityId: number,
  itemEntityId: number
) {
  const logger = getLogger('entity');
  if (hasComponent(world, Inventory, entityId)) {
    for (let i = 0; i < Inventory.items.length; i++) {
      if (Inventory.items[entityId][i] === 0) {
        // 0 is used as a placeholder for no item
        Inventory.items[entityId][i] = itemEntityId;
        removePhaserSprite(itemEntityId);
        break;
      }
    }
  } else {
    addComponent(world, Inventory, entityId);
    Inventory.items[entityId][0] = itemEntityId;
    removePhaserSprite(itemEntityId);
  }
  logger.info(
    `Added item ${getEntityNameWithID(
      itemEntityId
    )} to entity ${getEntityNameWithID(entityId)}'s inventory`
  );
  logger.debugVerbose(
    `Entity ${getEntityNameWithID(entityId)}'s inventory: ${
      Inventory.items[entityId]
    }`
  );
  logger.debug(getInventory(entityId));
}

export function getInventory(entityId: number) {
  const logger = getLogger('entity');
  const inventory = Inventory.items[entityId];
  let message = `${getEntityNameWithID(entityId)}'s inventory:\n`;
  for (const element of inventory) {
    if (element !== 0) {
      message += `  -${getEntityNameWithID(element)}\n`;
    }
  }
  logger.debug(message);
  return inventory;
}
