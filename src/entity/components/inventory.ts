import { ECS_NULL } from '@src/core/config/constants';
import { removePhaserSprite } from '@src/entity/components/phaserSprite';
import {
  getEntityName,
  getEntityNameWithID,
} from '@src/entity/systems/entityNames';
import { getLogger } from '@src/telemetry/systems/logger';
import { defineComponent, Types } from 'bitecs';

export const Inventory = defineComponent({
  items: [Types.ui16, 256], // Array of 256 possible items (entities)
});

export function addItemToInventory(entityId: number, itemEntityId: number) {
  const logger = getLogger('entity');
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

  const itemEntityId = Inventory.items[entityId][index];
  logger.info(
    `Removed item ${getEntityNameWithID(
      itemEntityId
    )} at index ${index} from entity ${getEntityNameWithID(
      entityId
    )}'s inventory`
  );

  // Set the item at the given index to ECS_NULL (no item)
  Inventory.items[entityId][index] = ECS_NULL;

  // Shift all items after the removed one to fill the gap
  for (let i = index; i < Inventory.items[entityId].length - 1; i++) {
    Inventory.items[entityId][i] = Inventory.items[entityId][i + 1];
  }

  // Set the last item to ECS_NULL as it's now an extra space
  Inventory.items[entityId][Inventory.items[entityId].length - 1] = ECS_NULL;
}

export function getInventory(entityId: number) {
  const logger = getLogger('entity');
  const inventory = Inventory.items[entityId];
  if (!inventory || inventory.length === 0) {
    logger.warn(`Entity ${getEntityNameWithID(entityId)} has no inventory`);
    return [];
  }

  const nonZeroInventory = inventory.filter((item) => item !== ECS_NULL);
  return [...nonZeroInventory] as number[];
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

export function removeItemByTypeFromInventory(
  entityId: number,
  itemTypeToRemove: string
) {
  const logger = getLogger('entity');

  let removed = false;

  for (let i = 0; i < Inventory.items[entityId].length; i++) {
    const itemId = Inventory.items[entityId][i];
    if (itemId === ECS_NULL) {
      continue;
    }
    const itemName = getEntityName(itemId).toLowerCase();
    if (itemId !== ECS_NULL && itemName === itemTypeToRemove) {
      // Remove the item from inventory and shift items
      removed = true;
      logger.info(
        `Removed item ${getEntityNameWithID(
          itemId
        )} at index ${i} from entity ${getEntityNameWithID(
          entityId
        )}'s inventory`
      );

      // Set the item at the given index to ECS_NULL (no item)
      Inventory.items[entityId][i] = ECS_NULL;

      // Shift all items after the removed one to fill the gap
      for (let j = i; j < Inventory.items[entityId].length - 1; j++) {
        Inventory.items[entityId][j] = Inventory.items[entityId][j + 1];
      }

      // Set the last item to ECS_NULL as it's now an extra space
      Inventory.items[entityId][Inventory.items[entityId].length - 1] =
        ECS_NULL;

      break;
    }
  }

  if (!removed) {
    logger.warn(
      `Item of type ${itemTypeToRemove} not found in entity ${getEntityNameWithID(
        entityId
      )}'s inventory`
    );
    return false;
  }

  return true;
}
