import {
  getInventory,
  removeItemFromInventory,
} from '@src/entity/components/inventory';
import items from '@src/entity/data/items.json';
import { getLogger } from '@src/telemetry/systems/logger';
import { getEntityName } from '@src/entity/systems/entityNames';

export function craftSimpleItem(entity: number, item: string) {
  const logger = getLogger('action');
  const entityInventory = getInventory(entity);
  const itemData = items.find((i) => i.id === item);

  if (!itemData || !itemData.recipe) {
    logger.info(`Item ${item} does not exist or does not have a recipe.`);
    return;
  }

  const missingIngredients = [];
  logger.debug(`Current inventory: ${JSON.stringify(entityInventory)}`);
  for (const ingredient of itemData.recipe) {
    const count = entityInventory.reduce((requiredItems, requiredItem) => {
      const itemName = getEntityName(requiredItem);
      if (itemName === undefined) {
        return requiredItems;
      }
      if (itemName.toLowerCase() === ingredient.id.toLowerCase()) {
        return requiredItems + 1;
      }
      return requiredItems;
    }, 0);

    if (count < ingredient.quantity) {
      missingIngredients.push({
        id: ingredient.id,
        required: ingredient.quantity,
        present: count,
      });
    }
  }

  if (missingIngredients.length > 0) {
    logger.info(`Missing ingredients: ${JSON.stringify(missingIngredients)}`);
    return;
  }

  for (const ingredient of itemData.recipe) {
    let toRemove = ingredient.quantity;
    for (let i = 0; i < entityInventory.length && toRemove > 0; i++) {
      const itemName = getEntityName(entityInventory[i]);
      if (itemName === undefined) {
        continue;
      }
      if (itemName.toLowerCase() === ingredient.id.toLowerCase()) {
        removeItemFromInventory(entity, i);
        toRemove--;
      }
    }
  }

  return {
    itemName: item,
    itemQuantity: 1,
  };
}
