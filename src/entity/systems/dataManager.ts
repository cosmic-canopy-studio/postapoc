import itemsData from '@src/entity/data/items.json';
import staticObjectsData from '@src/entity/data/staticObjects.json';
import { Item, StaticObject } from '@src/entity/data/types';
import { getLogger } from '@src/telemetry/systems/logger';

export const StaticObjectMap = new Map<string, StaticObject>(
  staticObjectsData.map((staticObject) => [staticObject.id, staticObject])
);
export const ItemMap = new Map<string, Item>(
  itemsData.map((item) => [item.id, item])
);

export function canItemBePickedUp(itemId: string) {
  const item = getItemDetails(itemId);
  getLogger('entity').debug('Item can be picked up:', item?.canBePickedUp);
  return item ? item.canBePickedUp : false;
}

export function getItemDetails(itemId: string) {
  const item = ItemMap.get(itemId.toLowerCase());
  getLogger('entity').debug('Item details:', item);
  return item || null;
}

export function getObjectDetails(objectId: string) {
  const object = StaticObjectMap.get(objectId.toLowerCase());
  getLogger('entity').debug('Object details:', object);
  return object || null;
}
