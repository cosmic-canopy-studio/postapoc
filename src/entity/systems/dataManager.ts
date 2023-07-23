import OpenableState, {
  OpenableStateType,
} from '@src/entity/components/openableState';
import itemsData from '@src/entity/data/items.json';
import staticObjectsData from '@src/entity/data/staticObjects.json';
import { GenericObject, Item, StaticObject } from '@src/entity/data/types';
import { getEntityName } from '@src/entity/systems/entityNames';
import { FULL_MOVEMENT } from '@src/movement/data/constants';
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

export function getEntityType(entityId: number) {
  const objectId = getEntityName(entityId);
  const baseObject = getGenericObjectDetails(objectId);
  return baseObject.type;
}

export function canItemBePickedUp(itemId: string) {
  const item = getItemDetails(itemId);
  getLogger('entity').debug('Item can be picked up:', item?.canBePickedUp);
  return item ? item.canBePickedUp : false;
}

export function hasProperty(entityId: number, property: string) {
  const objectId = getEntityName(entityId);
  const baseObject = getGenericObjectDetails(objectId);
  const hasProperty = baseObject.properties?.includes(property);
  getLogger('entity').debug(
    `Entity ${entityId} has property ${property}:`,
    hasProperty
  );
  return hasProperty ?? false;
}

export function getEntityState(entityId: number) {
  if (hasProperty(entityId, 'openable')) {
    const openableState = OpenableState.state[entityId] as OpenableStateType;

    if (openableState === OpenableStateType.CLOSED) {
      return 'closed';
    } else if (openableState === OpenableStateType.OPEN) {
      return 'open';
    } else if (openableState === OpenableStateType.LOCKED) {
      return 'locked';
    } else if (openableState === OpenableStateType.BROKEN) {
      return 'broken';
    } else {
      throw new Error(`Unknown openable state ${openableState}`);
    }
  } else {
    return '';
  }
}

export function getEntityTexture(entityId: number): string {
  const entityName = getEntityName(entityId).toLowerCase();
  const entityState = getEntityState(entityId);
  if (entityState !== '') {
    return `${entityName}_${entityState}`;
  } else {
    return entityName;
  }
}

export function getItemDetails(itemId: string) {
  const item = ItemMap.get(itemId.toLowerCase());
  getLogger('entity').debugVerbose('Item details:', item);
  return item ?? null;
}

export function getItemsInGroup(itemGroup: string) {
  const groupItems: string[] = [];

  for (const item of itemsData) {
    if (item.groups?.includes(itemGroup)) {
      groupItems.push(item.id);
    }
  }

  return groupItems;
}

export function getStaticObjectDetails(staticObjectId: string) {
  getLogger('entity').debugVerbose('Static object id:', staticObjectId);
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
  const focusExempt = genericObject.focusExempt ?? false;
  getLogger('entity').debug('Object exempt:', focusExempt);
  return focusExempt;
}

function getObjectIDCollisionModifier(objectId: string) {
  const staticObject = getGenericObjectDetails(objectId);

  const collisionModifier =
    staticObject.collisionModifier !== undefined
      ? staticObject.collisionModifier
      : FULL_MOVEMENT;
  getLogger('entity').debugVerbose(
    'Object collision modifier:',
    collisionModifier
  );
  return collisionModifier;
}

export function getEntityCollisionModifier(entityId: number) {
  if (hasProperty(entityId, 'openable')) {
    const openableState = getEntityState(entityId);

    if (openableState === 'open') {
      return FULL_MOVEMENT;
    }
  }

  // Default collision
  const objectId = getEntityName(entityId);
  return getObjectIDCollisionModifier(objectId);
}
