import { defineComponent, Types } from 'bitecs';
import { removePhaserSprite } from '@src/entity/components/phaserSprite';
import { getLogger } from '@src/telemetry/systems/logger';
import { getEntityNameWithID } from '@src/entity/systems/entityNames';
import { entityCanBePickedUp } from '@src/entity/components/canPickup';
import { ECS_NULL } from '@src/core/config/constants';

export const Inventory = defineComponent({
  items: [Types.ui16, 256], // Array of 256 possible items (entities)
});

export function addItemToInventory(entityId: number, itemEntityId: number) {
  const logger = getLogger('entity');

  const canBePickedUp = entityCanBePickedUp(itemEntityId);
  if (!canBePickedUp) {
    logger.warn(
      `Item ${getEntityNameWithID(itemEntityId)} cannot be picked up.`
    );
    return;
  }

  let itemAddedToInventory = false;
  for (let i = 0; i < Inventory.items[entityId].length; i++) {
    if (Inventory.items[entityId][i] === ECS_NULL) {
      // ECS_NULL is used as a placeholder for no item
      Inventory.items[entityId][i] = itemEntityId;
      removePhaserSprite(itemEntityId);
      itemAddedToInventory = true;
      break;
    }
  }

  if (!itemAddedToInventory) {
    logger.warn(
      `Item ${getEntityNameWithID(
        itemEntityId
      )} could not be added to entity ${getEntityNameWithID(
        entityId
      )}'s inventory because it is full`
    );
  } else {
    logger.info(
      `Added item ${getEntityNameWithID(
        itemEntityId
      )} to entity ${getEntityNameWithID(entityId)}'s inventory`
    );
  }
}

export function removeItemFromInventory(entityId: number, index: number) {
  const logger = getLogger('entity');

  if (index < 0 || index >= Inventory.items[entityId].length) {
    logger.warn(
      `Index ${index} is out of bounds for entity ${getEntityNameWithID(
        entityId
      )}'s inventory`
    );
    return;
  }

  // Set the item at the given index to ECS_NULL (no item)
  Inventory.items[entityId][index] = ECS_NULL;

  logger.info(
    `Removed item at index ${index} from entity ${getEntityNameWithID(
      entityId
    )}'s inventory`
  );
}

export function getInventory(entityId: number) {
  const logger = getLogger('entity');
  const inventory = Inventory.items[entityId];
  if (!inventory || inventory.length === 0) {
    logger.warn(`Entity ${getEntityNameWithID(entityId)} has no inventory`);
    return [];
  }
  return [...inventory] as number[];
}

export function listInventory(entityId: number) {
  const logger = getLogger('entity');
  const inventory = Inventory.items[entityId];
  let message = `${getEntityNameWithID(entityId)}'s inventory:\n`;
  if (!inventory || inventory.length === 0) {
    logger.warn(`Entity ${getEntityNameWithID(entityId)} has no inventory`);
    return;
  }
  for (const element of inventory) {
    if (element !== 0) {
      message += `  -${getEntityNameWithID(element)}\n`;
    }
  }
  return message;
}
