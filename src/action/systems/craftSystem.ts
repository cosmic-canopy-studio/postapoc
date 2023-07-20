import {
  getInventory,
  removeItemFromInventory,
} from '@src/entity/components/inventory';
import { Recipe, RecipeIngredient } from '@src/entity/data/types';
import { getItemDetails } from '@src/entity/systems/dataManager';
import { getEntityName } from '@src/entity/systems/entityNames';
import { getLogger } from '@src/telemetry/systems/logger';

export function craftSimpleItem(entityId: number, itemId: string) {
  const logger = getLogger('action');
  const itemDetails = getItemDetails(itemId);

  if (!itemDetails?.recipe) {
    logger.info(`Item ${itemId} does not exist or does not have a recipe.`);
    return;
  }

  const recipe: Recipe = itemDetails.recipe;

  const missingIngredients = checkForMissingItems(entityId, recipe);

  if (missingIngredients.length > 0) {
    logger.info(`Missing ingredients: ${JSON.stringify(missingIngredients)}`);
    return;
  }

  removeConsumedIngredients(recipe, entityId);

  return {
    itemName: itemId,
    itemQuantity: 1,
  };
}

export function checkForMissingItems(entityId: number, recipe: Recipe) {
  const logger = getLogger('action');
  const entityInventory = getInventory(entityId);
  const missingIngredients = [];
  logger.debug(`Current inventory: ${JSON.stringify(entityInventory)}`);
  for (const ingredient of recipe) {
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
  return missingIngredients;
}

function removeConsumedIngredients(
  recipe: RecipeIngredient[],
  entityId: number
) {
  const entityInventory = getInventory(entityId);
  for (const ingredient of recipe) {
    let toRemove = ingredient.quantity;
    for (let i = 0; i < entityInventory.length && toRemove > 0; i++) {
      const itemName = getEntityName(entityInventory[i]);
      if (itemName === undefined) {
        continue;
      }
      if (itemName.toLowerCase() === ingredient.id.toLowerCase()) {
        removeItemFromInventory(entityId, i);
        toRemove--;
      }
    }
  }
}
