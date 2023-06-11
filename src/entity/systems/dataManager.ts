import itemsData from '@src/entity/data/items.json';
import staticObjectsData from '@src/entity/data/staticObjects.json';
import { GenericObject, Item, StaticObject } from '@src/entity/data/types';
import { getEntityName } from '@src/entity/systems/entityNames';
import { getLogger } from '@src/telemetry/systems/logger';

const StaticObjectMap = new Map<string, StaticObject>(
  staticObjectsData.map((staticObject) => [staticObject.id, staticObject])
);
const ItemMap = new Map<string, Item>(itemsData.map((item) => [item.id, item]));

const CombinedObjectMap = new Map<string, GenericObject>([
  ...StaticObjectMap,
  ...ItemMap,
]);

export function getGenericObjectDetails(objectId: string) {
  const baseObject = CombinedObjectMap.get(objectId.toLowerCase());
  if (!baseObject) {
    throw new Error(`Could not find object with id ${objectId.toLowerCase()}`);
  }
  getLogger('entity').debugVerbose('Base object details:', baseObject);
  return baseObject;
}

export function canItemBePickedUp(itemId: string) {
  const item = getItemDetails(itemId);
  getLogger('entity').debug('Item can be picked up:', item?.canBePickedUp);
  return item ? item.canBePickedUp : false;
}

export function getItemDetails(itemId: string) {
  const item = ItemMap.get(itemId.toLowerCase());
  getLogger('entity').debugVerbose('Item details:', item);
  return item || null;
}

export function getStaticObjectDetails(staticObjectId: string) {
  const staticObject = StaticObjectMap.get(staticObjectId.toLowerCase());
  if (!staticObject) {
    throw new Error(
      `Could not find static object with id ${staticObjectId.toLowerCase()}`
    );
  }
  getLogger('entity').debugVerbose('Object details:', staticObject);
  return staticObject;
}

export function isEntityFocusExempt(entityId: number) {
  const objectId = getEntityName(entityId);
  return isObjectIdFocusExempt(objectId);
}

export function isObjectIdFocusExempt(objectId: string) {
  const genericObject = getGenericObjectDetails(objectId);
  const focusExempt = genericObject.focusExempt || false;
  getLogger('entity').debug('Object exempt:', focusExempt);
  return focusExempt;
}

function getObjectIDCollisionModifier(objectId: string) {
  const staticObject = getGenericObjectDetails(objectId);

  const collisionModifier =
    staticObject.collisionModifier !== undefined
      ? staticObject.collisionModifier
      : 1;
  getLogger('entity').debugVerbose(
    'Object collision modifier:',
    collisionModifier
  );
  return collisionModifier;
}

export function getEntityCollisionModifier(entityId: number) {
  const objectId = getEntityName(entityId);
  return getObjectIDCollisionModifier(objectId);
}
